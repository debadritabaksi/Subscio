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
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["Webhooks"])



async def process_simulated_signal(signal_id: str, org_id: str):
    """Background task to run AI scoring and pitch generation on a simulated signal."""
    from app.database import _get_session_factory
    from app.services.ai_service import get_ai_service
    from app.models.signal import SignalORM
    from app.models.lead import LeadORM
    from app.tasks import _get_seller_context
    import uuid

    factory = _get_session_factory()
    if not factory: return

    ai = get_ai_service()

    async with factory() as db:
        try:
            res = await db.execute(select(SignalORM).where(SignalORM.id == signal_id))
            signal = res.scalars().first()
            if not signal: return

            seller_name, seller_products = await _get_seller_context(db, org_id)

            # Analyze intent using AI
            analysis = await ai.analyze_intent(
                f"{signal.title} {signal.body}",
                seller_company_name=seller_name,
                seller_product_summary=seller_products
            )

            intent_stage = analysis.get("intent_stage", "awareness").lower()

            # Intent score mapping
            stage_scores = {
                "purchase_ready": 92,
                "consideration": 82,
                "awareness": 65,
                "targeting": 35
            }
            score = stage_scores.get(intent_stage, 50)

            signal.intent_stage = intent_stage
            signal.intent_score = score
            signal.status = "scored"

            if score >= 75:
                # Deduplication check by signal_id or title
                lead_exists = await db.execute(
                    select(LeadORM.id).where(
                        LeadORM.org_id == org_id,
                        (LeadORM.signal_id == signal.id) | (LeadORM.title == signal.title)
                    )
                )
                if not lead_exists.scalars().first():
                    pitch = await ai.generate_pitch(
                        context=f"Signal: {signal.title}. Body: {signal.body}",
                        seller_company_name=seller_name,
                        seller_product_summary=seller_products,
                        signal_type="OTHER"
                    )
                    lead = LeadORM(
                        org_id=org_id,
                        signal_id=signal.id,
                        company_name=signal.company_name,
                        title=signal.title,
                        summary=signal.body,
                        intent_stage=intent_stage,
                        quality_score=score,
                        urgency_score=5,
                        engagement_level="high",
                        corsair_status="pending_approval",
                        pitch_draft=pitch
                    )
                    db.add(lead)
                signal.status = "outreach_ready"

            await db.commit()
            logger.info(f"Simulated signal {signal_id} scored: stage={intent_stage}, score={score}")
        except Exception as e:
            await db.rollback()
            logger.error(f"Failed to process simulated signal {signal_id}: {e}")


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

        # Trigger dedicated signal scoring background task + global pipeline loop
        background_tasks.add_task(process_simulated_signal, signal.id, payload.org_id)
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
    """Returns all ingested signals sorted by priority (score) then time, strictly deduplicated by news headline."""
    import re
    from sqlalchemy import nullslast
    result = await db.execute(
        select(SignalORM).order_by(
            nullslast(SignalORM.intent_score.desc()),
            SignalORM.created_at.desc()
        )
    )
    signals = result.scalars().all()
    
    seen_titles = set()
    deduped = []
    for s in signals:
        norm_title = re.sub(r'\s+', ' ', (s.title or "").strip().lower())
        if not norm_title or norm_title in seen_titles:
            continue
        seen_titles.add(norm_title)
        deduped.append({
            "id": s.id,
            "org_id": s.org_id,
            "source": s.source,
            "category": s.category,
            "title": s.title,
            "body": s.body,
            "company_name": s.company_name,
            "dedup_hash": s.dedup_hash,
            "intent_score": s.intent_score,
            "intent_stage": s.intent_stage,
            "created_at": s.created_at.isoformat()
        })
    return deduped
