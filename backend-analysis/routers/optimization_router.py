# routers/optimization_router.py
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from services.optimization_service import OptimizationService

logger = logging.getLogger(__name__)
router = APIRouter()


class OptimizationRequest(BaseModel):
    resume_json: Dict[str, Any]
    role_json: Dict[str, Any]
    semantic_result: Dict[str, Any]   # fixed: was incorrectly named prediction_result


@router.post("/optimize-resume")
async def optimize_resume(req: OptimizationRequest):
    try:
        result = OptimizationService.simulate_resume_optimizations(
            resume_json=req.resume_json,
            role_json=req.role_json,
            semantic_result=req.semantic_result,
        )
        return result
    except Exception as exc:
        logger.error(f"Optimization endpoint error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
