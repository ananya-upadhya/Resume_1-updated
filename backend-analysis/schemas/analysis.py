# schemas/analysis.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class AnalysisResponse(BaseModel):
    # ── Core prediction ────────────────────────────────────────────
    shortlisting_probability: float

    # ── Module 2 score breakdown ───────────────────────────────────
    keyword_match_score: float = 0.0
    skill_alignment_score: float = 0.0
    achievement_strength_score: float = 0.0
    experience_relevance_score: float = 0.0
    ats_compliance_score: float = 0.0

    # ── Weak sections (sections scoring below 0.5) ────────────────
    weak_sections: List[str] = Field(default_factory=list)

    # ── Semantic matching ──────────────────────────────────────────
    semantic_fit_score: float = 0.0
    semantic_matches: List[Dict[str, Any]] = Field(default_factory=list)

    # ── Skills ────────────────────────────────────────────────────
    skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)

    # ── Groq-generated outputs ─────────────────────────────────────
    suggestions: List[str] = Field(default_factory=list)
    study_roadmap: Optional[Dict[str, Any]] = None
    skill_gap_explanation: Optional[str] = None
    optimization_opportunities: List[Dict[str, Any]] = Field(default_factory=list)

    # ── Explainability ─────────────────────────────────────────────
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    ats_verdict: Optional[str] = None
    one_line_summary: Optional[str] = None

    # ── Meta ───────────────────────────────────────────────────────
    mode: Optional[str] = "chained"
    warning: Optional[str] = None
