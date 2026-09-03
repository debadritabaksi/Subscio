"""
SUBSCIO — Async Database Engine & Session Management
PostgreSQL + pgvector connection classes using SQLAlchemy 2.0 async API.

NOTE: In Phase 1, the engine is lazily initialized. The database connection
is only established when init_db() is called during FastAPI lifespan startup.
This allows the app to run without PostgreSQL during early development.
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
    AsyncEngine,
)
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings


# ── Declarative Base ─────────────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


# ── Lazy Engine & Session ────────────────────────────────────────
# These are initialized only when init_db() is called.
_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def _get_engine() -> AsyncEngine:
    """Get or create the async engine (lazy singleton)."""
    global _engine
    if _engine is None:
        settings = get_settings()
        # SQLite specific configuration
        connect_args = {"check_same_thread": False, "timeout": 20.0} if "sqlite" in settings.DATABASE_URL else {}
        # Remove pool_size/max_overflow for SQLite
        kwargs = {} if "sqlite" in settings.DATABASE_URL else {"pool_size": 20, "max_overflow": 10, "pool_pre_ping": True}
        
        _engine = create_async_engine(
            settings.DATABASE_URL,
            echo=settings.DATABASE_ECHO,
            connect_args=connect_args,
            **kwargs
        )
    return _engine


def _get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Get or create the async session factory (lazy singleton)."""
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            bind=_get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return _session_factory


# ── Dependency Injection ─────────────────────────────────────────
async def get_db() -> AsyncSession:
    """
    FastAPI dependency that yields an async database session.
    Automatically closes the session when the request completes.
    """
    factory = _get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ── Lifecycle Hooks ──────────────────────────────────────────────
async def init_db():
    """
    Initialize the database — create all tables.
    Called during FastAPI lifespan startup.
    """
    engine = _get_engine()
    async with engine.begin() as conn:
        # SQLite doesn't support vector extension out of the box, skipping pgvector.
        await conn.run_sync(Base.metadata.create_all)
        
        # Schema migration for existing SQLite files
        try:
            from sqlalchemy import text
            await conn.execute(text("ALTER TABLE target_profiles ADD COLUMN search_terms TEXT"))
        except Exception:
            pass # Column already exists or database isn't SQLite
            
        from sqlalchemy import text
        try:
            await conn.execute(text("ALTER TABLE tenants ADD COLUMN website_url VARCHAR(255)"))
        except Exception: pass
        try:
            await conn.execute(text("ALTER TABLE tenants ADD COLUMN product_summary TEXT"))
        except Exception: pass
        try:
            await conn.execute(text("ALTER TABLE tenants ADD COLUMN phone_number VARCHAR(50)"))
        except Exception: pass
        try:
            await conn.execute(text("ALTER TABLE tenants ADD COLUMN logo_url VARCHAR(500)"))
        except Exception: pass


async def close_db():
    """Dispose of the async engine connection pool on shutdown."""
    global _engine, _session_factory
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _session_factory = None
