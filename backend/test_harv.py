import asyncio
from app.services.harvester import live_web_search

async def test():
    res = await live_web_search('"Infosys" business expansion OR funding OR contract')
    print("Result:", res)

asyncio.run(test())
