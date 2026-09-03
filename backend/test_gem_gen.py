import httpx
import os
import asyncio

async def test_gemini_generate():
    from dotenv import load_dotenv
    load_dotenv('.env')
    key = os.environ.get('GEMINI_KEY_DISCOVERY')
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}",
            json={"contents": [{"parts": [{"text": "Hello"}]}]}
        )
        print("3.5-flash:", res.status_code)

asyncio.run(test_gemini_generate())
