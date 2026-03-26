# routers/role_intelligence.py
from fastapi import APIRouter, HTTPException
from schemas.role_schema import RoleInput, RoleResponse
from services.role_intelligence_service import RoleIntelligenceService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/role-intelligence", response_model=RoleResponse)
async def process_role_intelligence(input_data: RoleInput):
    if not input_data.job_description.strip():
        raise HTTPException(status_code=400, detail="Empty job description")
    try:
        role_data = RoleIntelligenceService.process_job_description(input_data.job_description)
        return RoleResponse(status="success", role_data=role_data)
    except Exception as e:
        logger.error(f"Error processing job description: {e}")
        raise HTTPException(status_code=500, detail="Internal server error processing job description")
