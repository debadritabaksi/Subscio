import asyncio
from app.services.harvester import live_web_search

async def test():
    targets = ['Tata Consultancy Services', 'Infosys', 'Advantage Club', 'PhysicsWallah', 'Vantage Circle']
    for target in targets:
        query = f'"{target}" business expansion OR funding OR contract'
        res = await live_web_search(query)
        print(f"Results for {target}: {len(res)}")

asyncio.run(test())
