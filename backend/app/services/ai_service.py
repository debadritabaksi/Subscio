"""
SUBSCIO — Modular AI Service Interface
Abstraction layer that decouples AI reasoning from the specific LLM provider.
Implements the Gemini REST API with strict key separation and robust error handling.
"""

import os
import json
import logging
import time
from abc import ABC, abstractmethod
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv, find_dotenv
from app.config import get_settings

load_dotenv(find_dotenv(), override=True)

logger = logging.getLogger(__name__)



async def fetch_website_context(url: str) -> str:
    try:
        import httpx
        if "." not in url:
            # Fallback: Treat as a company name and query live news!
            from app.services.harvester import live_web_search
            news = await live_web_search(url)
            if news:
                context = f"Company Name: {url}\nRecent News:\n"
                for n in news[:3]:
                    context += f"- {n['title']}: {n['snippet']}\n"
                return context
            return f"Company Name: {url}. No website context available."
            
        if not url.startswith("http"):
            url = "https://" + url
            
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.title.string.strip() if soup.title else ""
        meta_desc = ""
        meta = soup.find("meta", attrs={"name": "description"})
        if meta and meta.get("content"):
            meta_desc = meta["content"].strip()
            
        headers = []
        for tag in ['h1', 'h2']:
            for h in soup.find_all(tag):
                headers.append(h.get_text(strip=True))
        headers_text = " | ".join(headers[:5])
            
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
        p_text = " ".join([p for p in paragraphs if len(p) > 20])[:1500]
        
        combined = f"Title: {title}\nMeta: {meta_desc}\nHeaders: {headers_text}\nContent: {p_text}"
        if not combined.strip():
            return "No additional website context available."
            
        return combined
    except Exception as e:
        logger.error(f"Website scraping failed: {e}")
        return "No additional website context available."


class AIService(ABC):
    """Abstract base class for all AI service implementations."""

    @abstractmethod
    async def analyze_intent(self, text: str) -> dict:
        pass

    @abstractmethod
    async def generate_pitch(self, context: str) -> str:
        pass

    @abstractmethod
    async def classify_signals(self, signals: list[dict]) -> list[dict]:
        pass

    @abstractmethod
    async def extract_entity_and_profile(self, signal_title: str, signal_summary: str, seller_products: str) -> dict:
        pass

    @abstractmethod
    async def generate_targets(self, company_url: str) -> list[str]:
        pass

    @abstractmethod
    async def generate_analytics_summary(self, data_context: str) -> str:
        pass


import httpx
import asyncio

class GeminiProductionService(AIService):
    """
    Production implementation using strict key isolation.
    Handles HTTP 429 asynchronously with non-blocking exponential backoff.
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.model_name = getattr(self.settings, "GEMINI_MODEL", "gemini-flash-latest")
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent"
        
        import itertools
        keys = [
            self.settings.GEMINI_KEY_DISCOVERY,
            self.settings.GEMINI_KEY_HARVESTER,
            self.settings.GEMINI_KEY_INTENT,
            self.settings.GEMINI_KEY_SCORING,
            self.settings.GEMINI_KEY_CORSAIR,
            self.settings.GEMINI_KEY_ANALYTICS,
        ]
        
        if self.settings.EXTRA_GEMINI_KEYS:
            keys.extend([k.strip() for k in self.settings.EXTRA_GEMINI_KEYS.split(",") if k.strip()])
            
        valid_keys = [k for k in keys if k]
        
        if not valid_keys:
            logger.warning("No Gemini API keys provided in configuration.")
            valid_keys = [""]
            
        self.key_pool = itertools.cycle(valid_keys)

    def _sanitize_output(self, text: str) -> str:
        text = text.strip()
        if not text:
            return text
            
        first_bracket = text.find('[')
        last_bracket = text.rfind(']')
        if first_bracket != -1 and last_bracket != -1 and first_bracket < last_bracket:
            return text[first_bracket:last_bracket+1]
            
        first_brace = text.find('{')
        last_brace = text.rfind('}')
        if first_brace != -1 and last_brace != -1 and first_brace < last_brace:
            return text[first_brace:last_brace+1]
            
        return text

    async def _call_groq_async(self, prompt: str) -> str:
        groq_key = getattr(self.settings, "GROQ_API_KEY", None) or os.getenv("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY", "").strip()
        if not groq_key:
            logger.error("No GROQ_API_KEY set, failover failed.")
            return ""
        
        logger.info("[AI Service] Groq fallback active with model openai/gpt-oss-20b.")
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {groq_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "openai/gpt-oss-20b",
            "messages": [
                {"role": "system", "content": "You must output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"}
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code != 200:
                    logger.error(f"Groq API Error {res.status_code}: {res.text}")
                    return ""
                res.raise_for_status()
                text = res.json()["choices"][0]["message"]["content"]
                return text
            except Exception as e:
                logger.error(f"Groq fallback request failed: {e}")
                return ""

    async def _call_ai_with_failover(self, prompt: str, response_mime_type: str = "text/plain") -> str:
        current_key = next(self.key_pool)
        if not current_key:
            return await self._call_groq_async(prompt)

        url = f"{self.base_url}?key={current_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": response_mime_type
            }
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            try:
                res = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                if res.status_code in [404, 429, 503]:
                    logger.warning(f"Gemini unavailable ({res.status_code}). Failing over to Groq (Llama 3.3 70B)...")
                    return await self._call_groq_async(prompt)
                res.raise_for_status()
                data = res.json()
                
                # Catch silent HTTP 200 errors from Gemini
                if "error" in data:
                    logger.warning(f"Gemini API Error Payload: {data['error']}")
                    return await self._call_groq_async(prompt)
                
                text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if not text:
                    logger.warning(f"Gemini returned empty text block. Failing over to Groq.")
                    return await self._call_groq_async(prompt)
                    
                return text
            except (httpx.TimeoutException, httpx.HTTPStatusError, ValueError, KeyError) as e:
                status = getattr(getattr(e, 'response', None), 'status_code', type(e).__name__)
                logger.warning(f"Gemini unavailable ({status}). Failing over to Groq (Llama 3.3 70B)...")
                return await self._call_groq_async(prompt)
            except asyncio.CancelledError:
                raise
            except Exception as e:
                logger.warning(f"Gemini unavailable ({type(e).__name__}). Failing over to Groq (Llama 3.3 70B)...")
                return await self._call_groq_async(prompt)

    async def _call_gemini_async(self, prompt: str, response_mime_type: str = "text/plain") -> str:
        """Legacy alias for backward compatibility. Uses dual-provider router."""
        return await self._call_ai_with_failover(prompt, response_mime_type)

    async def analyze_intent(self, text: str, seller_company_name: str = "", seller_product_summary: str = "") -> dict:
        seller_context = ""
        if seller_company_name:
            seller_context = f"CONTEXT: You are evaluating signals on behalf of {seller_company_name}"
            if seller_product_summary:
                seller_context += f", which provides: {seller_product_summary}"
            seller_context += ".\n"
            seller_context += (
                f"Evaluate whether the signal represents a commercial procurement opportunity, partnership trigger, "
                f"or budget expansion specifically relevant to {seller_company_name}'s offerings.\n"
                f"If the signal mentions a massive hiring drive, funding round, IPO, or corporate expansion, this is a HIGH INTENT (Score 80-95) trigger for {seller_company_name}, because expanding companies require bulk employee onboarding kits, welcome swag, and corporate gifting. If the news is just a single executive appointment (e.g., 'New CEO' or 'Vice Chairman'), score it LOW (under 30) as it does not trigger bulk hardware procurement.\n"
            )
        
        prompt = (
            "Analyze the following B2B company signal for buying intent.\n"
            f"{seller_context}"
            "Return strictly valid JSON with the following schema:\n"
            "{\n"
            '  "intent_stage": "targeting" | "awareness" | "consideration" | "purchase_ready",\n'
            '  "category": "funding" | "hiring" | "expansion" | "general",\n'
            '  "reasoning": "A 1-sentence explanation"\n'
            "}\n"
            "STRICT CLASSIFICATION RULES:\n"
            "- 'purchase_ready': ONLY for explicit commercial actions like procurement programs, bulk orders, vendor onboarding, tenders, or active purchasing programs directly relevant to the seller's product line.\n"
            "- 'consideration': For companies actively evaluating vendors, initiating partnership discussions, or expanding into areas requiring the seller's solutions.\n"
            "- 'awareness': For general expansion, office openings, press releases, tech stack changes, or ANY executive hire / board restructuring / leadership appointment with NO mention of procurement or vendor evaluation.\n"
            "- 'targeting': For any signal that merely fits an ICP profile but shows no active buying intent.\n"
            "CRITICAL: If the news is strictly about a CEO appointment, CXO hire, or board restructuring with NO mention of procurement, vendor evaluation, or budget expansion, classify as 'awareness' — NEVER as 'purchase_ready' or 'consideration'.\n"
            f"Signal text: {text}"
        )
        
        response = await self._call_gemini_async(
            prompt=prompt,
            response_mime_type="application/json"
        )
        
        try:
            parsed = json.loads(response)
            if not parsed:
                raise ValueError("Empty JSON response")
            # Enforce schema constraints
            valid_stages = ["targeting", "awareness", "consideration", "purchase_ready"]
            valid_cats = ["funding", "hiring", "expansion", "general"]
            
            stage = parsed.get("intent_stage", "targeting")
            cat = parsed.get("category", "general")
            
            if stage not in valid_stages: stage = "targeting"
            if cat not in valid_cats: cat = "general"
            
            return {
                "intent_stage": stage,
                "category": cat,
                "reasoning": parsed.get("reasoning", "Standard evaluation fallback."),
                "intent_score": 0,
                "key_entities": []
            }
        except Exception as e:
            logger.error(f"Intent parsing failed: {e}")
            return {
                "intent_stage": "awareness",
                "category": "general",
                "reasoning": "Fallback parsing due to invalid AI response.",
                "intent_score": 0,
                "key_entities": []
            }

    async def generate_pitch(self, context: str, seller_company_name: str = "", seller_product_summary: str = "", signal_type: str = "OTHER") -> str:
        seller_info = ""
        if seller_company_name:
            seller_info = f"You are drafting this pitch on behalf of {seller_company_name}"
            if seller_product_summary:
                seller_info += f", which provides: {seller_product_summary}"
            seller_info += ".\nPosition the seller's specific offerings as the solution to the buyer's needs.\n"
        
        framing_instructions = ""
        if signal_type == "ACTIVE_TENDER":
            framing_instructions = (
                "FRAME AS TENDER BID / VENDOR EMPANELMENT:\n"
                "Draft a formal expression of interest referencing the active tender requirements. "
                "Highlight our catalog depth, compliance, and rapid delivery timelines as an enterprise vendor.\n"
            )
        elif signal_type == "FUNDING_ROUND":
            framing_instructions = (
                "FRAME AS EXECUTIVE CONGRATULATORY OUTREACH:\n"
                "Acknowledge the recent funding round and team expansion. "
                "Position our products as the perfect solution for bulk onboarding welcome kits, milestone rewards, and team scaling.\n"
            )
            
        prompt = (
            "You are a master B2B sales copywriter (the 'Corsair' agent).\n"
            f"{seller_info}"
            f"{framing_instructions}"
            f"Based on this contextual signal:\n{context}\n\n"
            "Draft a highly targeted, 3-sentence plain text email pitch. "
            "Do not include subject lines or placeholders like [Name]. Just the body. "
            "Keep it sharp, value-driven, and end with a soft call to action."
        )
        return await self._call_ai_with_failover(
            prompt=prompt
        )

    async def classify_signals(self, signals: list[dict]) -> list[dict]:
        results = []
        for signal in signals:
            analysis = await self.analyze_intent(signal.get("title", ""))
            results.append({**signal, **analysis})
        return results

    async def extract_entity_and_profile(self, signal_title: str, signal_summary: str, seller_products: str) -> dict:
        prompt = (
            "Analyze the provided business news item/tender notice. Extract:\n"
            "1. company_name: The primary company raising capital, issuing the tender, or expanding.\n"
            "2. industry: The primary industry of the target company.\n"
            "3. signal_type: Classify as 'FUNDING_ROUND', 'ACTIVE_TENDER', 'EXPANSION', or 'OTHER'.\n"
            f"4. purchase_intent_rationale: Explain how this event creates direct demand for {seller_products}.\n\n"
            "Return STRICT JSON: {\"company_name\": \"str\", \"industry\": \"str\", \"signal_type\": \"str\", \"purchase_intent_rationale\": \"str\"}\n\n"
            f"News Title: {signal_title}\n"
            f"News Summary: {signal_summary}"
        )
        # Specifically force the Groq fallback which enforces valid JSON for this extraction task
        response = await self._call_groq_async(prompt)
        try:
            parsed = json.loads(self._sanitize_output(response))
            if "company_name" in parsed and "signal_type" in parsed:
                return parsed
            raise ValueError("Missing required fields")
        except Exception as e:
            logger.error(f"Entity extraction failed: {e}")
            return {
                "company_name": "Unknown Entity",
                "industry": "Unknown",
                "signal_type": "OTHER",
                "purchase_intent_rationale": "Extraction failed."
            }

    async def generate_targets(self, company_url: str) -> list[dict]:
        scraped_text = await fetch_website_context(company_url)
        
        prompt = (
            "You are an elite B2B Sales Strategist and Market Intent Expert.\n"
            f"User Company URL: {company_url}\n"
            f"Scraped Context: {scraped_text}\n\n"
            "Generate 5 target B2B buyer companies for the seller. Because we are scraping public news, target companies must be:\n"
            "1. High-growth startups likely to have recently raised funding.\n"
            "2. Large enterprises known for massive hiring drives.\n"
            "3. Corporate rewards/loyalty aggregators (e.g., Zaggle, Xoxoday).\n\n"
            "Output Requirements:\n"
            "1. Generate exactly 5 target buyer accounts.\n"
            "2. Ensure the parser returns structured dicts with real, distinct company names for `company_name`.\n"
            "3. For the `search_terms` field, output strict news-friendly growth queries, such as: `(\"funding\" OR \"raises\" OR \"hiring\" OR \"expansion\" OR \"milestone\" OR \"anniversary\")`.\n"
            "4. Return strictly valid JSON array of objects. Do not include markdown formatting.\n"
            "Example:\n"
            "[\n"
            "  {\n"
            '    "company_name": "Zaggle",\n'
            '    "industry": "Corporate Rewards",\n'
            '    "search_terms": "(\\"funding\\" OR \\"raises\\" OR \\"hiring\\" OR \\"expansion\\")"\n'
            "  }\n"
            "]\n"
        )
        
        response = await self._call_ai_with_failover(
            prompt=prompt,
            response_mime_type="application/json"
        )
        
        try:
            if not response or not response.strip():
                raise ValueError("Empty AI response received.")
            parsed = json.loads(self._sanitize_output(response))
            if isinstance(parsed, list) and len(parsed) > 0:
                return parsed[:5]
            raise ValueError("Invalid array format")
        except Exception as e:
            logger.error(f"Agent 1 Fatal Crash: {str(e)}", exc_info=True)
            return [
                {
                    "company_name": "Generic Target",
                    "industry": "Corporate Gifting",
                    "search_terms": "corporate gifting OR bulk procurement"
                }
            ]

    async def generate_analytics_summary(self, data_context: str) -> str:
        prompt = (
            "You are an executive revenue operations AI.\n"
            "Given this structured analytics aggregation data, write a 2-sentence executive summary of pipeline trends.\n"
            f"Data: {data_context}"
        )
        return await self._call_ai_with_failover(
            prompt=prompt
        )


def get_ai_service() -> AIService:
    """Returns the production Gemini service by default."""
    return GeminiProductionService()
