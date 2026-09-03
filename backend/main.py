"""
SUBSCIO — FastAPI Application Entry Point
The Signals Harvesting Engine backend server.

Runs with: uvicorn main:app --reload --port 8000
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import health, webhooks, context, analytics, auth


settings = get_settings()


# ── Lifespan (startup / shutdown hooks) ──────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Async lifespan manager — initializes and tears down resources."""
    # Startup
    print(">> SUBSCIO Engine starting...")
    print(f"   Environment: {settings.ENV}")
    print(f"   AI Provider: {settings.AI_PROVIDER}")
    # Initialize PostgreSQL Database
    from app.database import init_db
    await init_db()
    yield
    # Shutdown
    print(">> SUBSCIO Engine shutting down...")
    from app.database import close_db
    await close_db()


# ── FastAPI Instance ─────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Signals Harvesting Engine for sales intelligence automation.",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS Middleware ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Route Registration ───────────────────────────────────────────
app.include_router(health.router)
app.include_router(webhooks.router)
app.include_router(context.router)
app.include_router(analytics.router)
app.include_router(auth.router)


# ── Root ─────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "engine": "SUBSCIO",
        "status": "operational",
        "docs": "/docs",
    }
