# routers/semantic_matching.py
from fastapi import APIRouter, HTTPException
from schemas.semantic_schema import SemanticMatchRequest, SemanticMatchResponse
from services.semantic_matching_service import semantic_matcher
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/semantic-match", response_model=SemanticMatchResponse)
async def semantic_match(request: SemanticMatchRequest):
    try:
        result = semantic_matcher.compute_semantic_fit(request.resume_json, request.role_json)
        return SemanticMatchResponse(semantic_fit_score=result["semantic_fit_score"], matches=result["matches"])
    except Exception as e:
        logger.error(f"Semantic comparison failed: {e}")
        raise HTTPException(status_code=500, detail="Internal processing error")
