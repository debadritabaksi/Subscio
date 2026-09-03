import hashlib
import json
import logging
import httpx
import re
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.signal import SignalORM, SignalSource, SignalCategory

logger = logging.getLogger(__name__)

async def ingest_signal(
    session: AsyncSession,
    org_id: str,
    source: str,
    category: str,
    title: str,
    body: str,
    company_name: str,
    raw_payload: dict = None
) -> SignalORM:
    """
    Core function for Agent 2: Signal Harvester.
    Ingests a raw signal, computes dedup hash, and saves to DB.
    Returns the saved SignalORM object, or raises exception if duplicate.
    """
    # 1. Idempotency Encryption Hash Check
    content = json.dumps(
        {
            "source": source,
            "category": category,
            "title": title,
            "body": body,
            "company_name": company_name,
        },
        sort_keys=True,
    )
    dedup_hash = hashlib.sha256(content.encode()).hexdigest()

    # 1.5. Check existence BEFORE inserting to prevent IntegrityError transaction breaks
    from sqlalchemy import select
    existing = await session.execute(select(SignalORM).where(SignalORM.dedup_hash == dedup_hash))
    if existing.scalars().first():
        logger.info(f"Duplicate signal skipped: {title} ({dedup_hash})")
        return None

    # 2. Save to PostgreSQL
    signal = SignalORM(
        org_id=org_id,
        source=source,
        category=category,
        title=title,
        body=body,
        company_name=company_name,
        dedup_hash=dedup_hash,
        raw_payload=json.dumps(raw_payload) if raw_payload else None,
        created_at=datetime.now(timezone.utc),
        status="un_analyzed"
    )
    
    session.add(signal)
    try:
        await session.flush()
        await session.refresh(signal)
    except Exception as e:
        await session.rollback()
        logger.warning(f"Failed to flush signal, rolling back: {e}")
        raise e
    
    logger.info(f"Ingested unique signal: {title} ({dedup_hash})")
    
    # In a fully event-driven system, saving here would trigger Agent 3.
    # For now, it's saved as an un-analyzed row (intent_score=None).
    return signal

async def live_web_search(query: str) -> list[dict]:
    """Live Google News RSS scraping utility."""
    import asyncio
    encoded_query = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        for attempt in range(3):
            await asyncio.sleep(2.0)  # RSS Rate Limit Protection
            try:
                res = await client.get(url, headers=headers, timeout=15)
                if res.status_code == 429:
                    logger.warning(f"HTTP 429 Rate limit hit for {query}. Retrying in {2 ** attempt}s...")
                    await asyncio.sleep(2 ** attempt)
                    continue
                res.raise_for_status()
                
                root = ET.fromstring(res.text)
                snippets = []
                for item in root.findall(".//item")[:3]:
                    title = item.findtext("title") or "No Title"
                    desc = item.findtext("description") or ""
                    clean_desc = re.sub('<[^<]+>', '', desc).strip()
                    snippets.append({"title": title, "snippet": clean_desc})
                return snippets
            except httpx.HTTPError as e:
                logger.error(f"HTTP Error for {query}: {e}")
                if attempt == 2:
                    return []
            except Exception as e:
                logger.error(f"Live search parsing failed for {query}: {e}")
                return []
        return []

async def fetch_historical_backfill(session: AsyncSession, org_id: str, company_name: str, search_terms: str = ""):
    """
    The Day-Zero Backfill (Historical Data Pass).
    Triggers when a target company is registered for the first time.
    """
    logger.info(f"Running Day-Zero Backfill for {company_name}")
    
    from app.services.ai_service import get_ai_service
    ai = get_ai_service()
    
    # Use search_terms dynamically from Agent 1, strictly forcing Growth Terms
    if search_terms:
        query = f'"{company_name}" AND {search_terms} when:14d'
    else:
        query = f'"{company_name}" when:14d'
    all_news = await live_web_search(query)
    
    if not all_news:
        logger.warning(f"No live signals found for {company_name}.")
        return
        
    for article in all_news[:3]:
        snippet = article["snippet"]
        news_title = article["title"]
        
        try:
            await ingest_signal(
                session=session,
                org_id=org_id,
                source="rss_feed",
                category="general",
                title=news_title,
                body=f"Snippet: {snippet}",
                company_name=company_name
            )
        except Exception as e:
            logger.warning(f"Backfill duplicate or error: {e}")

async def harvest_global_firehose(session: AsyncSession, org_id: str, seller_company: str, seller_products: str) -> list[dict]:
    """
    Signal-First Global Harvester: Monitors broad RSS firehoses for high-intent triggers.
    Filters locally and returns fresh, unprocessed signal dictionaries.
    """
    logger.info("Starting Global Firehose Harvest...")
    
    feeds = [
        ("RSS", "https://inc42.com/feed/"),
        ("RSS", "https://entrackr.com/feed/"),
        ("Tender", "https://news.google.com/rss/search?q=(allintitle:tender+OR+allintitle:RFP+OR+allintitle:procurement)+AND+(gifting+OR+merchandise+OR+electronics+OR+supplies)+when:14d&hl=en-IN&gl=IN&ceid=IN:en")
    ]
    
    intent_keywords = {"raises", "funding", "series", "tender", "rfp", "procurement", "expansion", "secures"}
    
    fresh_signals = []
    seen_hashes = set()
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    from sqlalchemy import select
    
    async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
        for source_type, url in feeds:
            try:
                res = await client.get(url, headers=headers)
                if res.status_code != 200:
                    continue
                    
                root = ET.fromstring(res.text)
                for item in root.findall(".//item"):
                    title = item.findtext("title") or ""
                    desc = item.findtext("description") or ""
                    clean_desc = re.sub('<[^<]+>', '', desc).strip()
                    
                    combined_text = f"{title} {clean_desc}".lower()
                    
                    # Heuristic Filtering: Must contain at least one high-intent keyword
                    if not any(kw in combined_text for kw in intent_keywords):
                        continue
                        
                    # We don't know the exact company name yet, it will be extracted in Agent 2.
                    # Use a placeholder so dedup still works.
                    raw_signal = {
                        "source": source_type,
                        "category": "commercial_intent",
                        "title": title,
                        "body": f"Snippet: {clean_desc}",
                        "company_name": "DYNAMIC_EXTRACTION_PENDING"
                    }
                    
                    content = json.dumps(raw_signal, sort_keys=True)
                    dedup_hash = hashlib.sha256(content.encode()).hexdigest()
                    
                    if dedup_hash in seen_hashes:
                        continue
                    seen_hashes.add(dedup_hash)
                    
                    # Check DB
                    existing = await session.execute(select(SignalORM.id).where(SignalORM.dedup_hash == dedup_hash))
                    if existing.scalars().first():
                        continue
                        
                    raw_signal["dedup_hash"] = dedup_hash
                    fresh_signals.append(raw_signal)
                    
            except Exception as e:
                logger.error(f"Failed to harvest {url}: {e}")
                
    logger.info(f"Global Firehose returned {len(fresh_signals)} fresh signals.")
    return fresh_signals
