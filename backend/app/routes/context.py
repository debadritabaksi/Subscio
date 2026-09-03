from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ai_service import get_ai_service
from app.services.harvester import fetch_historical_backfill, ingest_signal
from app.database import get_db, _get_session_factory
from app.routes.auth import get_current_user
from app.models.target_profile import TargetProfileORM
from app.models.signal import SignalSource, SignalCategory
import asyncio
import uuid

router = APIRouter(prefix="/api/v1/context", tags=["Context Setup"])

class ContextInitializeRequest(BaseModel):
    company_url: str
    org_id: str = "default-tenant"

class SemanticQueryOutput(BaseModel):
    user_company_type: str
    extracted_target_keywords: List[str]
    semantic_search_queries: List[str]

async def run_historical_backfill(org_id: str, company_name: str):
    """Runs day-zero backfill safely in background."""
    factory = _get_session_factory()
    if not factory:
        return
    async with factory() as session:
        await fetch_historical_backfill(session, org_id, company_name)

async def parallel_discovery_search(queries: List[str], org_id: str):
    """Mocks parallel async search using HTTP async clients."""
    print(f">> Starting background discovery for queries: {queries}")
    await asyncio.sleep(2)  # Simulate network latency
    print(">> Discovery search completed. Found additional lookalikes.")
    # In a real app, this would use httpx and write to TargetProfileORM

async def execute_agent_1_discovery(request: ContextInitializeRequest):
    """Executes Agent 1 (Context Discovery) as an asynchronous background task."""
    factory = _get_session_factory()
    if not factory:
        return
        
    async with factory() as db:
        try:
            ai = get_ai_service()
            # 1. Agent 1 (Discovery)
            targets = await ai.generate_targets(request.company_url)
            
            for target in targets:
                new_target = TargetProfileORM(
                    id=str(uuid.uuid4()),
                    org_id=request.org_id,
                    name=target.get("company_name", "Unknown Target"),
                    description=target.get("industry", "AI Discovered Target"),
                    search_terms=target.get("search_terms", ""),
                    status="discovered"
                )
                db.add(new_target)
            
            await db.commit()
            
            # For demonstration without a running Celery Beat worker, we manually trigger the downstream tasks.
            # In a true production environment, Celery Beat handles `agent2_harvester_cron` independently.
            from app.tasks import execute_sequential_pipeline_loop
            await execute_sequential_pipeline_loop()
            
        except Exception as e:
            print(f"Error in Agent 1 pipeline: {e}")

@router.post("/initialize")
async def initialize_context(
    request: ContextInitializeRequest, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Agent 1 (Context & Discovery Engine):
    Parses the business footprint using an LLM to extract semantic search queries.
    Saves the target profiles and kicks off discovery.
    """
    ai = get_ai_service()
    
    # Mocking the AI response for the hackathon UI demo
    parsed_intent = {
        "user_company_type": "B2B Marketplace",
        "extracted_target_keywords": ["cosmetic brands", "skincare labels", "indie beauty"],
        "semantic_search_queries": ["international cosmetics expanding globally", "D2C beauty brands funding"]
    }
    
    try:
        # Fire Agent 1 Pipeline
        background_tasks.add_task(execute_agent_1_discovery, request)
        
        return {
            "status": "success",
            "message": "Context initialized and discovery engine started.",
            "data": parsed_intent,
            "manual_targets_saved": []
        }
    except Exception as e:
        await db.rollback()
        return {"status": "error", "detail": str(e)}


# ── Pipeline Refresh (Non-Destructive) ────────────────────────────
class PipelineRefreshRequest(BaseModel):
    org_id: str = "default-tenant"

async def _execute_full_refresh(org_id: str):
    """Background task: Re-runs the Signal-First Pipeline non-destructively."""
    import logging
    logger = logging.getLogger(__name__)
    
    factory = _get_session_factory()
    if not factory:
        return
    
    try:
        from app.tasks import execute_sequential_pipeline_loop
        await execute_sequential_pipeline_loop(org_id)
        
        logger.info(f"Refresh: Full Signal-First pipeline completed for org_id={org_id}")
        
    except Exception as e:
        import traceback
        logger.error(f"Refresh pipeline crashed: {e}\n{traceback.format_exc()}")

@router.post("/refresh")
async def refresh_pipeline(
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user)
):
    """
    Non-destructive pipeline refresh: Re-runs Agent 1 → 5 in the background.
    New signals get fresh timestamps and sort to the top of the feed.
    """
    background_tasks.add_task(_execute_full_refresh, current_user.tenant_id)
    
    return {
        "status": "refresh_initiated",
        "message": "Pipeline discovery and harvesting cycle started in background."
    }
