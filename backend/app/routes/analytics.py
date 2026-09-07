from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, literal_column
from app.database import get_db
from app.models.lead import LeadORM
from app.models.signal import SignalORM
from app.services.ai_service import get_ai_service
import json

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/summary")
async def get_analytics_summary(db: AsyncSession = Depends(get_db)):
    """
    Agent 6 (Intelligence Dashboard Engine):
    Aggregates intent classification status tags using high-performance SQL window functions.
    Uses LLM to provide a final executive summary.
    """
    # High-performance Funnel Conversion Grouping
    stage_counts_result = await db.execute(
        select(func.lower(LeadORM.intent_stage), func.count(LeadORM.id)).group_by(func.lower(LeadORM.intent_stage))
    )
    stage_counts = dict(stage_counts_result.all())
    
    # Calculate ranking inside categories via Window Function
    # (e.g. rank leads by score within their intent stage)
    ranked_leads_subquery = select(
        LeadORM.id,
        func.row_number().over(
            partition_by=LeadORM.intent_stage,
            order_by=LeadORM.quality_score.desc()
        ).label("rank_in_stage")
    ).subquery()
    
    # Select top 5 leads per intent stage
    aliased_lead = select(LeadORM).join(
        ranked_leads_subquery, LeadORM.id == ranked_leads_subquery.c.id
    ).where(ranked_leads_subquery.c.rank_in_stage <= 5).order_by(LeadORM.quality_score.desc())
    
    leads_result = await db.execute(aliased_lead)
    leads = leads_result.scalars().all()
    
    total_signals = await db.scalar(select(func.count(SignalORM.id)))
    
    # Prepare data context for AI summary
    data_context = {
        "funnel_distribution": {
            "targeting": stage_counts.get("targeting", 0),
            "awareness": stage_counts.get("awareness", 0),
            "consideration": stage_counts.get("consideration", 0),
            "purchase_ready": stage_counts.get("purchase_ready", 0),
        },
        "total_signals_harvested": total_signals
    }
    
    # Return static summary to prevent blocking Gemini calls on every page load
    executive_summary = "Pipeline is active. See funnel distribution for current status."
    
    seen_lead_titles = set()
    deduped_pipeline = []
    for l in leads:
        norm_t = (l.title or "").strip().lower()
        if norm_t and norm_t in seen_lead_titles:
            continue
        if norm_t:
            seen_lead_titles.add(norm_t)
        deduped_pipeline.append({
            "id": l.id,
            "company_name": l.company_name,
            "title": l.title,
            "intent_stage": l.intent_stage,
            "quality_score": l.quality_score,
            "pitch_draft": l.pitch_draft,
            "corsair_status": l.corsair_status,
            "created_at": l.created_at.isoformat()
        })
    
    return {
        "funnel_distribution": data_context["funnel_distribution"],
        "executive_summary": executive_summary,
        "pipeline": deduped_pipeline,
        "total_signals_harvested": total_signals
    }
