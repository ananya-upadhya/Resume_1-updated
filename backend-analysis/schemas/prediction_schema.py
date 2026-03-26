# schemas/prediction_schema.py
from pydantic import BaseModel, Field
from typing import Dict, Any

class ScoreBreakdown(BaseModel):
    semantic_fit: float
    skill_match: float
    experience_relevance: float
    achievement_strength: float
    ats_compliance: float

class PredictionRequest(BaseModel):
    resume_json: Dict[str, Any]
    role_json: Dict[str, Any]
    semantic_result: Dict[str, Any]

class PredictionResponse(BaseModel):
    shortlisting_probability: float
    score_breakdown: ScoreBreakdown
