import asyncio
import httpx
import urllib.parse
import xml.etree.ElementTree as ET
import re

async def test_search():
    query = '"Infosys" business expansion OR funding OR contract'
    encoded_query = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        res = await client.get(url, headers=headers, timeout=15)
        print("Status:", res.status_code)
        if res.status_code != 200:
            print("Response:", res.text[:200])
            return
            
        try:
            root = ET.fromstring(res.text)
            items = root.findall(".//item")
            print("Found items:", len(items))
            for item in items[:1]:
                print("Title:", item.findtext("title"))
                print("Desc:", item.findtext("description"))
        except Exception as e:
            print("XML Parse Error:", str(e))
            print("Response snippet:", res.text[:200])

asyncio.run(test_search())
