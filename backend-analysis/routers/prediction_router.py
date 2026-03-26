# routers/prediction_router.py
from fastapi import APIRouter, HTTPException
from schemas.prediction_schema import PredictionRequest, PredictionResponse
from services.prediction_service import PredictionService

router = APIRouter()

@router.post("/predict-shortlisting", response_model=PredictionResponse)
async def predict_shortlisting(request: PredictionRequest):
    try:
        result = PredictionService.compute_shortlisting_probability(request.resume_json, request.role_json, request.semantic_result)
        return PredictionResponse(shortlisting_probability=result["shortlisting_probability"], score_breakdown=result["score_breakdown"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
