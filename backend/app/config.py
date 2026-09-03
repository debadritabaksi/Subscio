"""
SUBSCIO — Application Configuration
Uses pydantic-settings for environment-based config with strict validation.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)


class Settings(BaseSettings):
    """
    Global application settings loaded from environment variables or .env file.
    All secrets and connection strings are configured here.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ──────────────────────────────────────────────
    APP_NAME: str = "SUBSCIO Signals Harvesting Engine"
    ENV: str = "DEVELOPMENT"  # DEVELOPMENT | HACKATHON | PRODUCTION
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./subscio.db"
    DATABASE_ECHO: bool = False

    # ── AI Service ───────────────────────────────────────────────
    AI_PROVIDER: str = "development"  # development | rabbitt | openai | gemini
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GEMINI_KEY_DISCOVERY: str = ""
    GEMINI_KEY_HARVESTER: str = ""
    GEMINI_KEY_INTENT: str = ""
    GEMINI_KEY_SCORING: str = ""
    GEMINI_KEY_CORSAIR: str = ""
    GEMINI_KEY_ANALYTICS: str = ""
    EXTRA_GEMINI_KEYS: str = ""
    RABBITT_API_KEY: str = ""
    GOOGLE_API_KEY: str | None = None
    GOOGLE_CSE_ID: str | None = None
    GROQ_API_KEY: str | None = None

    # ── CORS ─────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]


@lru_cache()
def get_settings() -> Settings:
    """Cached settings singleton — loaded once per process lifecycle."""
    return Settings()
