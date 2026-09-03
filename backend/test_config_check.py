from app.config import get_settings

s = get_settings()
print(f"GEMINI_MODEL = {getattr(s, 'GEMINI_MODEL', 'NOT SET')}")
print(f"GROQ_API_KEY set = {bool(s.GROQ_API_KEY)}")
print(f"GEMINI_KEY_DISCOVERY set = {bool(s.GEMINI_KEY_DISCOVERY)}")
print(f"GEMINI_KEY_HARVESTER set = {bool(s.GEMINI_KEY_HARVESTER)}")
print(f"GEMINI_KEY_INTENT set = {bool(s.GEMINI_KEY_INTENT)}")
print(f"GEMINI_KEY_SCORING set = {bool(s.GEMINI_KEY_SCORING)}")
print(f"GEMINI_KEY_CORSAIR set = {bool(s.GEMINI_KEY_CORSAIR)}")
print(f"GEMINI_KEY_ANALYTICS set = {bool(s.GEMINI_KEY_ANALYTICS)}")
