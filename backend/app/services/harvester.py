import hashlib
import json
import logging
import httpx
import re
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.signal import SignalORM

logger = logging.getLogger(__name__)

def compute_signal_hash(org_id: str, title: str) -> str:
    """Canonical title-based cryptographic hash ensuring identical news articles never duplicate."""
    clean_title = re.sub(r'\s+', ' ', title or "").strip().lower()
    return hashlib.sha256(f"{org_id}:{clean_title}".encode("utf-8")).hexdigest()

def is_article_relevant_to_target(target_name: str, title: str, snippet: str) -> bool:
    """Verify that the target company actually appears in the article before attributing it."""
    if not target_name or target_name.upper() in ("DYNAMIC_EXTRACTION_PENDING", "UNKNOWN ENTITY", "GENERIC TARGET"):
        return True
    clean_target = re.sub(r'(?i)\b(ltd|limited|inc|incorporated|pvt|private|corp|corporation|technologies|solutions|holdings|group)\b', '', target_name).strip().lower()
    if len(clean_target) < 3:
        clean_target = target_name.strip().lower()
    combined = f"{title} {snippet}".lower()
    return clean_target in combined

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
    Ingests a raw signal, computes canonical dedup hash, and saves to DB.
    Returns the saved SignalORM object, or None if duplicate.
    """
    # 1. Canonical Title-Based Cryptographic Deduplication Hash Check
    dedup_hash = compute_signal_hash(org_id, title)

    # 1.5. Check existence BEFORE inserting to prevent duplicate records
    from sqlalchemy import select
    existing = await session.execute(
        select(SignalORM).where(
            SignalORM.org_id == org_id,
            (SignalORM.dedup_hash == dedup_hash) | (SignalORM.title == title)
        )
    )
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

async def fetch_historical_backfill(session: AsyncSession, org_id: str, company_name: str, search_terms: str = "", seller_company: str = "", seller_products: str = ""):
    """
    The Day-Zero Backfill (Historical Data Pass).
    Triggers when a target company is registered for the first time.
    """
    logger.info(f"Running Day-Zero Backfill for {company_name}")
    
    # Use search_terms dynamically from Agent 1, strictly forcing Growth Terms
    if search_terms:
        query = f'"{company_name}" AND {search_terms} when:14d'
    else:
        query = f'"{company_name}" AND (funding OR raises OR expansion OR hiring OR tender OR contract) when:14d'
    all_news = await live_web_search(query)
    
    if not all_news:
        logger.warning(f"No live signals found for {company_name}.")
        return
        
    backfill_negative_keywords = {
        "death", "died", "dies", "dead", "killing", "killed", "murder", "accident", "crash",
        "tuberculosis", "cancer", "disease", "obituary", "condolences", "funeral", "tragedy",
        "arrest", "arrested", "fraud", "scam", "jail", "court", "police", "fir", "suicide",
        "laid off", "layoffs", "shuts down", "shutdown", "closure", "closed", "bankrupt",
        "bankruptcy", "insolvency", "derails", "losses", "lawsuit", "hiring freeze", "cost cutting",
        "restructuring", "strike"
    }

    for article in all_news[:3]:
        snippet = article["snippet"]
        news_title = article["title"]
        combined_text = f"{news_title} {snippet}".lower()

        if any(kw in combined_text for kw in backfill_negative_keywords):
            logger.info(f"Backfill rejected signal due to negative keyword: {news_title}")
            continue

        # Target Relevance check: ensure the target name actually appears in the article
        if not is_article_relevant_to_target(company_name, news_title, snippet):
            logger.info(f"Backfill skipping article not mentioning target '{company_name}': {news_title}")
            continue
        
        try:
            await ingest_signal(
                session=session,
                org_id=org_id,
                source="historical_backfill",
                category="general",
                title=news_title,
                body=f"Snippet: {snippet}",
                company_name=company_name
            )
        except Exception as e:
            logger.warning(f"Backfill duplicate or error: {e}")

async def harvest_global_firehose(session: AsyncSession, org_id: str, seller_company: str, seller_products: str) -> list[dict]:
    """
    Target-Aware & Context-Driven Harvester:
    Queries Google News RSS dynamically per target profile registered for the org.
    Falls back to high-intent product-based RSS queries if no targets exist yet.
    Filters locally and returns fresh, unprocessed signal dictionaries.
    """
    logger.info(f"Starting Harvester pass for seller '{seller_company}' ({org_id})...")

    from sqlalchemy import select
    from app.models.target_profile import TargetProfileORM

    # Fetch tracked target profiles for the seller's org
    targets_res = await session.execute(
        select(TargetProfileORM.name, TargetProfileORM.search_terms)
        .where(TargetProfileORM.org_id == org_id)
    )
    targets = targets_res.all()

    # Build dynamic search URLs per target
    search_queries = []
    if targets:
        for name, terms in targets:
            clean_name = name.strip()
            if not clean_name or clean_name.lower() in ("generic target", "unknown entity"):
                continue
            if terms:
                query = f'"{clean_name}" AND {terms} when:14d'
            else:
                query = f'"{clean_name}" AND (funding OR raises OR hiring OR expansion OR tender OR procurement) when:14d'
            search_queries.append((clean_name, query))

    # Fallback to seller product/domain queries if no target accounts found
    if not search_queries:
        product_terms = seller_products if seller_products else "enterprise software OR technology services"
        search_queries = [
            ("DYNAMIC_EXTRACTION_PENDING", f'({product_terms}) AND (tender OR RFP OR procurement OR expansion OR funding) when:14d'),
            ("DYNAMIC_EXTRACTION_PENDING", '("funding round" OR "series A" OR "series B" OR "secures funding") AND (startup OR tech) when:14d')
        ]

    intent_keywords = {"raises", "funding", "series", "tender", "rfp", "procurement", "expansion", "secures", "acquisition", "hiring", "contracts", "grant", "investment", "order", "vendor", "onboarding", "purchase", "supplier", "empanelment", "po", "rfq"}

    negative_keywords = {
        "death", "died", "dies", "dead", "killing", "killed", "murder", "accident", "crash",
        "tuberculosis", "cancer", "disease", "obituary", "condolences", "funeral", "tragedy",
        "arrest", "arrested", "fraud", "scam", "jail", "court", "police", "fir", "suicide",
        "laid off", "layoffs", "shuts down", "shutdown", "closure", "closed", "bankrupt",
        "bankruptcy", "insolvency", "derails", "losses", "lawsuit", "hiring freeze", "cost cutting",
        "restructuring", "strike", "ceo appointment", "board reshuffle", "board appointment",
        "executive appointment"
    }

    fresh_signals = []
    seen_hashes = set()
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
        for target_name, query in search_queries:
            encoded_query = urllib.parse.quote(query)
            url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"

            try:
                res = await client.get(url, headers=headers)
                if res.status_code != 200:
                    continue

                root = ET.fromstring(res.text)
                for item in root.findall(".//item")[:5]:  # limit to top 5 per target
                    title = item.findtext("title") or ""
                    desc = item.findtext("description") or ""
                    clean_desc = re.sub('<[^<]+>', '', desc).strip()
                    combined_text = f"{title} {clean_desc}".lower()

                    # Heuristic Intent Filter
                    if not any(kw in combined_text for kw in intent_keywords):
                        continue

                    # Negative Sentiment & Irrelevance Filter
                    if any(kw in combined_text for kw in negative_keywords):
                        logger.info(f"Rejected signal due to negative sentiment: {title}")
                        continue

                    assigned_company = target_name
                    if not is_article_relevant_to_target(target_name, title, clean_desc):
                        assigned_company = "DYNAMIC_EXTRACTION_PENDING"

                    raw_signal = {
                        "source": "RSS",
                        "category": "commercial_intent",
                        "title": title,
                        "body": f"Snippet: {clean_desc}",
                        "company_name": assigned_company
                    }

                    dedup_hash = compute_signal_hash(org_id, title)

                    if dedup_hash in seen_hashes:
                        continue
                    seen_hashes.add(dedup_hash)

                    # Check DB idempotency
                    existing = await session.execute(
                        select(SignalORM.id).where(
                            SignalORM.org_id == org_id,
                            (SignalORM.dedup_hash == dedup_hash) | (SignalORM.title == title)
                        )
                    )
                    if existing.scalars().first():
                        continue

                    raw_signal["dedup_hash"] = dedup_hash
                    fresh_signals.append(raw_signal)

            except Exception as e:
                logger.error(f"Failed to harvest query '{query}': {e}")

    logger.info(f"Harvester pass returned {len(fresh_signals)} fresh, target-filtered signals.")
    return fresh_signals
