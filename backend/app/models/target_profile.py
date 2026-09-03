"""
SUBSCIO — Target Profile Data Models
Represents discovered companies that match the ICP (Ideal Customer Profile).
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Index, Text
from sqlalchemy.orm import Mapped, mapped_column
from pydantic import BaseModel, Field
from app.database import Base


# ── SQLAlchemy ORM Model ─────────────────────────────────────────
class TargetProfileORM(Base):
    """Represents a target lookalike company to track."""

    __tablename__ = "target_profiles"
    __table_args__ = (
        Index("ix_target_profiles_org_id", "org_id"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain_url: Mapped[str] = mapped_column(String(500), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    search_terms: Mapped[str] = mapped_column(Text, nullable=True)
    is_blacklisted: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(50), default="discovered")
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


# ── Pydantic Schemas ─────────────────────────────────────────────
class TargetProfileCreate(BaseModel):
    org_id: str = Field(default="default-tenant")
    name: str = Field(..., max_length=255)
    domain_url: str | None = None
    description: str | None = None
    is_blacklisted: bool = False


class TargetProfileResponse(BaseModel):
    id: str
    org_id: str
    name: str
    domain_url: str | None
    description: str | None
    is_blacklisted: bool
    created_at: datetime

    model_config = {"from_attributes": True}
