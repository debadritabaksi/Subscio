import httpx
import os
import asyncio

async def test_gemini():
    from dotenv import load_dotenv
    load_dotenv('.env')
    key = os.environ.get('GEMINI_KEY_DISCOVERY')
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={key}")
        if res.status_code == 200:
            models = res.json().get('models', [])
            print([m['name'] for m in models if 'flash' in m['name']])
        else:
            print(res.status_code, res.text)

asyncio.run(test_gemini())
