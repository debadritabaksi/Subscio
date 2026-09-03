"""
SUBSCIO — Lead / Opportunity Data Models
Represents processed and scored leads derived from raw signals.
Includes Dark Funnel intent stage classification (6sense-style).
"""

import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import String, Text, Integer, DateTime, Float, Index
from sqlalchemy.orm import Mapped, mapped_column
from pydantic import BaseModel, Field
from app.database import Base


# ── Enums ────────────────────────────────────────────────────────
class IntentStage(str, Enum):
    """Dark Funnel intent stages — visual badge classification."""
    TARGETING = "targeting"        # 🟣 Fits ICP, no active signals
    AWARENESS = "awareness"        # 🔵 Reading news, general expansion
    CONSIDERATION = "consideration"  # 🟡 Hiring in your domain
    PURCHASE_READY = "purchase_ready"  # 🔴 Funded + hiring decision-makers


# ── SQLAlchemy ORM Model ─────────────────────────────────────────
class LeadORM(Base):
    """
    Scored and enriched lead derived from one or more signals.
    Includes intent classification and quality score for prioritization.
    """

    __tablename__ = "leads"
    __table_args__ = (
        Index("ix_leads_org_id", "org_id"),
        Index("ix_leads_intent_stage", "intent_stage"),
        Index("ix_leads_quality_score", "quality_score"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    signal_id: Mapped[str] = mapped_column(String(36), nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    intent_stage: Mapped[str] = mapped_column(String(30), nullable=False)
    quality_score: Mapped[int] = mapped_column(Integer, default=0)
    urgency_score: Mapped[float] = mapped_column(Float, default=0.0)
    engagement_level: Mapped[str] = mapped_column(String(20), default="low")
    enrichment_data: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Phase 5: Corsair Security Gateway fields
    pitch_draft: Mapped[str] = mapped_column(Text, nullable=True)
    corsair_status: Mapped[str] = mapped_column(String(50), default="pending_analysis")
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


# ── Pydantic Schemas ─────────────────────────────────────────────
class LeadCreate(BaseModel):
    signal_id: str
    company_name: str = Field(..., max_length=255)
    title: str = Field(..., max_length=500)
    summary: str = ""
    intent_stage: IntentStage = IntentStage.TARGETING
    quality_score: int = Field(default=0, ge=0, le=100)
    org_id: str = Field(default="default-tenant")


class LeadResponse(BaseModel):
    id: str
    org_id: str
    signal_id: str
    company_name: str
    title: str
    summary: str | None
    intent_stage: str
    quality_score: int
    urgency_score: float
    engagement_level: str
    created_at: datetime

    model_config = {"from_attributes": True}
