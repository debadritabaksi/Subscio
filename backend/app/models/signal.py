"""
SUBSCIO — Signal Data Models
Represents raw business signals ingested from APIs, webhooks, or backfills.
Includes SHA-256 deduplication hash for strict idempotency.
"""

import uuid
import hashlib
import json
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import String, Text, Integer, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column
from pydantic import BaseModel, Field, model_validator
from app.database import Base


# ── Enums ────────────────────────────────────────────────────────
class SignalSource(str, Enum):
    GITHUB_API = "github_api"
    RSS_FEED = "rss_feed"
    WEBHOOK_SIMULATE = "webhook_simulate"
    ATS_PUBLIC = "ats_public"
    HISTORICAL_BACKFILL = "historical_backfill"


class SignalCategory(str, Enum):
    FUNDING = "funding"
    HIRING = "hiring"
    TECH_STACK = "tech_stack"
    EXPANSION = "expansion"
    PARTNERSHIP = "partnership"
    CREATOR = "creator"


# ── SQLAlchemy ORM Model ─────────────────────────────────────────
class SignalORM(Base):
    """
    Raw ingested signal. The `dedup_hash` column enforces idempotency —
    duplicate signal payloads are rejected at the database level.
    """

    __tablename__ = "harvested_signals"
    __table_args__ = (
        Index("ix_harvested_signals_org_id", "org_id"),
        Index("ix_harvested_signals_dedup_hash", "dedup_hash", unique=True),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=True)
    dedup_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    raw_payload: Mapped[str] = mapped_column(Text, nullable=True)
    intent_score: Mapped[int] = mapped_column(Integer, nullable=True)
    intent_stage: Mapped[str] = mapped_column(String(50), default="targeting")
    status: Mapped[str] = mapped_column(String(50), default="un_analyzed")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


# ── Pydantic Schemas ─────────────────────────────────────────────
class SignalIngest(BaseModel):
    """Incoming signal payload for the simulate-signal webhook."""

    source: SignalSource
    category: SignalCategory
    title: str = Field(..., min_length=1, max_length=500)
    body: str = Field(default="", max_length=5000)
    company_name: str = Field(default="", max_length=255)
    org_id: str = Field(default="default-tenant")
    raw_payload: dict | None = None

    # Auto-compute the deduplication hash from the signal body
    dedup_hash: str = ""

    @model_validator(mode="after")
    def compute_dedup_hash(self):
        """Generate SHA-256 hash from signal content for idempotency."""
        content = json.dumps(
            {
                "source": self.source.value,
                "category": self.category.value,
                "title": self.title,
                "body": self.body,
                "company_name": self.company_name,
            },
            sort_keys=True,
        )
        self.dedup_hash = hashlib.sha256(content.encode()).hexdigest()
        return self


class SignalResponse(BaseModel):
    id: str
    org_id: str
    source: str
    category: str
    title: str
    body: str | None
    company_name: str | None
    dedup_hash: str
    intent_score: int | None
    intent_stage: str
    created_at: datetime

    model_config = {"from_attributes": True}
