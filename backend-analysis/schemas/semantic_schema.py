# schemas/semantic_schema.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SemanticMatchDetail(BaseModel):
    resume_sentence: str
    job_requirement: str
    similarity: float

class SemanticMatchRequest(BaseModel):
    resume_json: Dict[str, Any]
    role_json: Dict[str, Any]

class SemanticMatchResponse(BaseModel):
    semantic_fit_score: float
    matches: List[SemanticMatchDetail]
