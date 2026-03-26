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
        result = explainability_service.generate_suggestions(
            resume_json=request.resume_json,
            role_json=request.role_json,
            prediction_result=request.prediction_result,
        )
        return ExplainabilityResponse(
            strengths=[],
            weaknesses=[],
            suggestions=result.get("suggestions", []),
            study_roadmap=result.get("study_roadmap"),
            skill_gap_explanation=result.get("skill_gap_explanation"),
            ats_verdict=None,
            one_line_summary=None,
        )
    except Exception as exc:
        logger.error(f"Explainability endpoint error: {exc}")
        raise HTTPException(status_code=500, detail="Internal error in explainability service")
