import asyncio
from app.services.harvester import live_web_search

async def test():
    company_name = "Infosys"
    query = f'"{company_name}" business expansion OR funding OR contract'
    res = await live_web_search(query)
    print("Result for", company_name, ":", res)

asyncio.run(test())
