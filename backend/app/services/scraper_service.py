import logging
from typing import List, Dict, Any
from app.services.harvester import live_web_search
from app.services.ai_service import get_ai_service

logger = logging.getLogger(__name__)

async def scrape_recent_signals(company_name: str, search_terms: str = None) -> List[Dict[str, Any]]:
    """
    Scrapes live signals for a given company using DuckDuckGo search.
    Feeds raw snippets into the AI intent analyzer to extract structured signal data.
    """
    signals = []
    
    if search_terms:
        queries = [
            f'"{company_name}" ({search_terms}) when:30d',
        ]
    else:
        queries = [
            f'"{company_name}" (procurement OR tender OR vendor OR "bulk order") when:30d',
        ]
    
    ai = get_ai_service()
    
    for query in queries:
        try:
            articles = await live_web_search(query)
            for article in articles[:2]:
                news_title = article["title"]
                snippet = article["snippet"]
                signals.append({
                    "source": "rss_feed",
                    "category": "general",
                    "title": news_title,
                    "body": f"Source: Live Search\nSnippet: {snippet}",
                })
        except Exception as e:
            logger.error(f"Error scraping signals for {company_name}: {e}")
    
    return signals
