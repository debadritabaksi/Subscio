"""
SUBSCIO — Webhook Simulation Routes
POST /api/v1/webhooks/simulate-signal
Accepts structured JSON payloads and returns 202 Accepted within 50ms.
Enforces idempotency via SHA-256 dedup hashing.
"""

from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.signal import SignalIngest, SignalORM
from app.services.harvester import ingest_signal
from app.tasks import execute_sequential_pipeline_loop
import asyncio
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["Webhooks"])



@router.post(
    "/simulate-signal",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=dict,
    summary="Simulate a business signal ingestion"
)
async def simulate_signal(
    payload: SignalIngest, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Agent 2 (Signal Harvester) - Simulated webhooks
    """
    try:
        signal = await ingest_signal(
            session=db,
            org_id=payload.org_id,
            source=payload.source.value,
            category=payload.category.value,
            title=payload.title,
            body=payload.body,
            company_name=payload.company_name,
            raw_payload=payload.raw_payload
        )
        
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "error": "duplicate_signal",
                    "message": "This signal has already been ingested.",
                    "dedup_hash": payload.dedup_hash,
                },
            )
        
        # Trigger Agent 3 & 4 & 5 instantly for the hackathon demo
        background_tasks.add_task(execute_sequential_pipeline_loop)
        
        return {
            "status": "accepted",
            "signal_id": signal.id,
            "dedup_hash": signal.dedup_hash,
            "message": "Signal queued for AI processing.",
        }
    except Exception as e:
        # Check if it's a unique constraint violation (duplicate)
        error_msg = str(e).lower()
        if "unique" in error_msg and "dedup_hash" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "error": "duplicate_signal",
                    "message": "This signal has already been ingested.",
                    "dedup_hash": payload.dedup_hash,
                },
            )
        else:
            # Re-raise unexpected errors
            logger.error(f"Error ingesting signal: {e}")
            raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/signals",
    response_model=list[dict],
    summary="List all ingested signals",
)
async def list_signals(db: AsyncSession = Depends(get_db)):
    """Returns all ingested signals in reverse chronological order."""
    result = await db.execute(select(SignalORM).order_by(SignalORM.created_at.desc()))
    signals = result.scalars().all()
    
    return [
        {
            "id": s.id,
            "org_id": s.org_id,
            "source": s.source,
            "category": s.category,
            "title": s.title,
            "body": s.body,
            "company_name": s.company_name,
            "dedup_hash": s.dedup_hash,
            "intent_score": s.intent_score,
            "created_at": s.created_at.isoformat()
        } for s in signals
    ]
