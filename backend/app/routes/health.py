"""
SUBSCIO — Health Check Endpoint
Quick liveness probe for verifying the API is responsive.
"""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Returns system health status and engine version."""
    return {
        "status": "operational",
        "engine": "SUBSCIO Signals Harvesting Engine",
        "version": "0.1.0-phase1",
        "phase": "deep_scaffold",
    }
