import asyncio
import logging

from sqlalchemy import select
from app.database import _get_session_factory
from app.models.target_profile import TargetProfileORM
from app.models.signal import SignalORM, SignalSource, SignalCategory
from app.models.lead import LeadORM
from app.services.ai_service import get_ai_service
import uuid
import hashlib
import json

logger = logging.getLogger(__name__)


async def _get_seller_context(db, org_id: str) -> tuple:
    """Fetch the seller's company name and product summary from the database."""
    from app.models.tenant import TenantORM
    tenant_result = await db.execute(select(TenantORM).where(TenantORM.id == org_id))
    tenant = tenant_result.scalars().first()
    seller_name = tenant.name if tenant else "Unknown Company"
    
    # Aggregate search_terms from target profiles as a proxy for the seller's product line
    targets_result = await db.execute(
        select(TargetProfileORM.search_terms, TargetProfileORM.description)
        .where(TargetProfileORM.org_id == org_id)
    )
    targets = targets_result.all()
    terms = set()
    for t in targets:
        if t.search_terms:
            terms.update([s.strip() for s in t.search_terms.split("OR")])
        if t.description:
            terms.add(t.description)
    product_summary = ", ".join(list(terms)[:10]) if terms else "B2B enterprise solutions"
    
    return seller_name, product_summary

def run_async(coro):
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)


async def execute_sequential_pipeline_loop(org_id: str = None):
    """
    Unified Signal-First Pipeline Orchestration.
    """
    logger.info(">> Starting Signal-First Pipeline Loop...")
    factory = _get_session_factory()
    if not factory: return "Database factory not initialized"
    
    ai = get_ai_service()
    from app.services.harvester import harvest_global_firehose
    import datetime
    
    async with factory() as db:
        try:
            # 1. Retrieve Context
            if org_id:
                orgs_to_process = [org_id]
            else:
                from app.models.tenant import TenantORM
                res = await db.execute(select(TenantORM.id))
                orgs_to_process = [str(r) for r in res.scalars().all()]
                
            for current_org in orgs_to_process:
                seller_name, seller_products = await _get_seller_context(db, current_org)
                
                # 2. Execute Global Firehose
                logger.info(f"Harvesting global firehose for org {current_org}")
                raw_signals = await harvest_global_firehose(db, current_org, seller_name, seller_products)
                
                for raw in raw_signals:
                    try:
                        # 3. Dynamic Entity Extraction (Agent 2 -> Agent 1 bridge)
                        extracted = await ai.extract_entity_and_profile(
                            raw.get("title", ""), 
                            raw.get("body", ""), 
                            seller_products
                        )
                        
                        company_name = extracted.get("company_name", "Unknown Entity")
                        industry = extracted.get("industry", "Unknown")
                        signal_type = extracted.get("signal_type", "OTHER")
                        rationale = extracted.get("purchase_intent_rationale", "")
                        
                        # Validate Entity
                        if company_name == "Unknown Entity" or company_name == "DYNAMIC_EXTRACTION_PENDING":
                            continue
                            
                        # Upsert Target Profile
                        existing_target = await db.execute(
                            select(TargetProfileORM).where(TargetProfileORM.org_id == current_org, TargetProfileORM.name == company_name)
                        )
                        target_profile = existing_target.scalars().first()
                        
                        if not target_profile:
                            target_profile = TargetProfileORM(
                                id=str(uuid.uuid4()),
                                org_id=current_org,
                                name=company_name,
                                description=industry,
                                search_terms=signal_type,
                                status="monitoring"
                            )
                            db.add(target_profile)
                            await db.flush() # flush to generate id
                            
                        # Save Signal with extracted company
                        new_signal = SignalORM(
                            org_id=current_org,
                            source=raw.get("source", "RSS"),
                            category=raw.get("category", "commercial_intent"),
                            title=raw.get("title", ""),
                            body=raw.get("body", ""),
                            company_name=company_name,
                            dedup_hash=raw.get("dedup_hash"),
                            status="scored",
                            raw_payload=json.dumps(extracted)
                        )
                        db.add(new_signal)
                        await db.flush()
                        
                        # 4. Intent Classification & Scoring
                        base_score = 30
                        intent_stage = "DISQUALIFIED"
                        urgency_str = "LOW"
                        
                        if signal_type == "ACTIVE_TENDER":
                            base_score = 90
                            intent_stage = "PURCHASE_READY"
                            urgency_str = "CRITICAL"
                        elif signal_type == "FUNDING_ROUND":
                            base_score = 85
                            intent_stage = "CONSIDERATION"
                            urgency_str = "HIGH"
                        elif signal_type == "EXPANSION":
                            base_score = 70
                            intent_stage = "AWARENESS"
                            urgency_str = "MEDIUM"
                            
                        new_signal.intent_score = base_score
                        
                        # Only draft leads for high-intent signals (score >= 75)
                        if base_score >= 75:
                            # 5. Generate Outreach Draft (Agent 5)
                            # Do this BEFORE adding to DB to avoid holding a write lock during the LLM call!
                            context = f"Signal: {new_signal.title}. Rationale: {rationale}"
                            try:
                                pitch = await ai.generate_pitch(
                                    context=context,
                                    seller_company_name=seller_name,
                                    seller_product_summary=seller_products,
                                    signal_type=signal_type
                                )
                            except Exception as e:
                                logger.error(f"Failed to generate pitch for company {company_name}: {e}")
                                pitch = f"Hi {company_name}, noticed your {signal_type}. We can help."

                            lead = LeadORM(
                                org_id=current_org,
                                signal_id=new_signal.id,
                                company_name=company_name,
                                title=new_signal.title,
                                summary=new_signal.body,
                                intent_stage=intent_stage,
                                quality_score=base_score,
                                urgency_score=10 if urgency_str == "CRITICAL" else 5,
                                engagement_level="high",
                                corsair_status="pending_approval",
                                pitch_draft=pitch
                            )
                            db.add(lead)
                            new_signal.status = "outreach_ready"
                        else:
                            new_signal.status = "scored"
                            
                        # Commit per signal to prevent long SQLite write locks
                        await db.commit()
                            
                    except Exception as e:
                        logger.error(f"Error processing signal: {e}")
                        await db.rollback()
                        # Keep processing other signals in the batch
            
            logger.info(">> Pipeline completed successfully.")
            return "Pipeline executed successfully."
            
        except Exception as e:
            await db.rollback()
            logger.error(f">> PIPELINE CRASH: {e}", exc_info=True)
            return f"Pipeline failed: {e}"


