# schemas/explainability_schema.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class ExplainabilityRequest(BaseModel):
    resume_json: Dict[str, Any]
    role_json: Dict[str, Any]
    semantic_result: Dict[str, Any]
    prediction_result: Dict[str, Any]


class ExplainabilityResponse(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    study_roadmap: Optional[Dict[str, Any]] = None
    skill_gap_explanation: Optional[str] = None
    ats_verdict: Optional[str] = None
    one_line_summary: Optional[str] = None
