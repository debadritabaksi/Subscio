import asyncio
import httpx
from bs4 import BeautifulSoup

async def live_web_search(query: str):
    url = "https://html.duckduckgo.com/html/"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    async with httpx.AsyncClient() as client:
        res = await client.get(url, params={"q": query}, headers=headers, timeout=10)
        print("Status:", res.status_code)
        soup = BeautifulSoup(res.text, 'html.parser')
        snippets = [a.get_text(strip=True) for a in soup.find_all('a', class_='result__snippet')]
        print("Snippets:", snippets)

asyncio.run(live_web_search("Infosys"))
