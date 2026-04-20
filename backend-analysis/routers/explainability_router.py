# routers/explainability_router.py
import logging
from fastapi import APIRouter, HTTPException
from schemas.explainability_schema import ExplainabilityRequest, ExplainabilityResponse
from services.explainability_service import explainability_service

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/explain-analysis", response_model=ExplainabilityResponse)
async def explain_analysis(request: ExplainabilityRequest):
    try:
        result = explainability_service.generate_analysis_explanation(
            resume_json=request.resume_json,
            role_json=request.role_json,
            semantic_result=request.semantic_result,
            prediction_result=request.prediction_result,
        )
        return ExplainabilityResponse(
            strengths=result.get("strengths", []),
            weaknesses=result.get("weaknesses", []),
            suggestions=result.get("suggestions", []),
            ats_verdict=result.get("ats_verdict"),
            one_line_summary=result.get("one_line_summary"),
        )
    except Exception as exc:
        logger.error(f"Explainability endpoint error: {exc}")
        raise HTTPException(status_code=500, detail="Internal error in explainability service")
