import json
import logging
from typing import Dict, Any, List, Optional

from config.settings import settings
from prompts.templates import PROMPT_3_EXPLAINABILITY
from services.llm_client import call_llm

logger = logging.getLogger(__name__)


class ExplainabilityService:
    @staticmethod
    def _explain_via_llm(
        resume_json: Dict[str, Any],
        role_json: Dict[str, Any],
        semantic_result: Dict[str, Any],
        prediction_result: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """Prompt 3 — Explainability Engine via Groq/Claude."""
        analysis_json = {
            "resume": resume_json,
            "role": role_json,
            "semantic_result": semantic_result,
            "prediction_result": prediction_result,
        }
        prompt = PROMPT_3_EXPLAINABILITY.replace("{{ANALYSIS_JSON}}", json.dumps(analysis_json, default=str))
        try:
            out = call_llm(prompt, temperature=0.3)
        except Exception as e:
            logger.warning(f"LLM explainability failed, falling back to heuristic: {e}")
            return None
        
        # Normalize suggestions to list of strings for backward compat; keep detail if present
        raw_suggestions = out.get("suggestions") or []
        suggestions = []
        for s in raw_suggestions:
            if isinstance(s, dict) and "action" in s:
                suggestions.append(s["action"])
            elif isinstance(s, str):
                suggestions.append(s)
        return {
            "strengths": out.get("strengths") or [],
            "weaknesses": out.get("weaknesses") or [],
            "suggestions": suggestions,
            "ats_verdict": out.get("ats_verdict"),
            "one_line_summary": out.get("one_line_summary"),
        }

    @staticmethod
    def generate_analysis_explanation(
        resume_json: Dict[str, Any],
        role_json: Dict[str, Any],
        semantic_result: Dict[str, Any],
        prediction_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        if settings.USE_LLM:
            result = ExplainabilityService._explain_via_llm(
                resume_json, role_json, semantic_result, prediction_result
            )
            if result is not None:
                return result
        
        strengths = []
        weaknesses = []
        suggestions = []
        
        # 1. Analyze Semantic Match
        semantic_score = semantic_result.get("semantic_fit_score", 0.0)
        if semantic_score > 0.7:
            # Try to grab a key responsibility for a tailored message
            top_resp = role_json.get("responsibilities", ["the required domain"])[0]
            if len(top_resp.split()) > 5:
                # Truncate slightly for readability
                top_resp = " ".join(top_resp.split()[:5]) + "..."
            strengths.append(f"Strong experience in {top_resp.lower()} development.")
        elif semantic_score > 0.5:
            strengths.append("Good semantic alignment with the job description.")
        else:
            weaknesses.append("Low semantic alignment with the job description. Your experience descriptions do not closely match the role requirements.")
            suggestions.append("Rewrite your experience bullets to incorporate language and keywords used in the job description where applicable.")
            
        # 2. Analyze Skill Overlap
        resume_skills = set(s.lower() for s in resume_json.get("skills", []))
        role_skills = set(s.lower() for s in role_json.get("required_skills", []))
        
        missing_skills = role_skills - resume_skills
        matched_skills = role_skills.intersection(resume_skills)
        
        if len(matched_skills) > 0:
            if len(role_skills) > 0 and (len(matched_skills) / len(role_skills)) >= 0.7:
                 strengths.append(f"Strong skill match ({len(matched_skills)}/{len(role_skills)} required skills found).")
            else:
                 strengths.append(f"Matching skills identified: {', '.join(sorted([s.title() for s in matched_skills])[:5])}{'...' if len(matched_skills) > 5 else ''}")
        
        if missing_skills:
             missing_list = sorted(list(missing_skills))
             for missing in missing_list[:3]:
                 weaknesses.append(f"{missing.title()} skill is missing for this role.")
             suggestions.append(f"Include technologies required by the job description (e.g., {', '.join([s.title() for s in missing_list[:3]])}).")
             
        # 3. Analyze Achievements
        score_breakdown = prediction_result.get("score_breakdown", {})
        achievement_score = score_breakdown.get("achievement_strength", 0.0)
        
        if achievement_score >= 0.7:
             strengths.append("Strong use of quantified achievements and measurable results in your experience section.")
        elif achievement_score < 0.3:
             weaknesses.append("Limited quantified achievements detected.")
             suggestions.append("Add measurable achievements such as performance improvements.")
             
        # 4. Analyze Experience Level
        exp_score = score_breakdown.get("experience_relevance", 0.0)
        if exp_score >= 0.8:
            strengths.append("Experience duration closely matches or exceeds role requirements.")
        elif exp_score < 0.5:
            weaknesses.append("Experience duration may be less than required by the role.")
            suggestions.append("Highlight high-impact projects or relevant coursework to compensate for potential experience gaps.")
            
        # 5. Analyze ATS Compliance (General formatting/sections presence)
        ats_score = score_breakdown.get("ats_compliance", 0.0)
        if ats_score < 1.0:
             missing_sections = []
             if not resume_json.get("skills"): missing_sections.append("Skills")
             if not resume_json.get("experience"): missing_sections.append("Experience")
             if not resume_json.get("education"): missing_sections.append("Education")
             
             if missing_sections:
                 weaknesses.append(f"Missing standard resume sections: {', '.join(missing_sections)}")
                 suggestions.append(f"Ensure your resume includes clearly labeled sections for: {', '.join(missing_sections)}")
                 
        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "suggestions": suggestions,
            "ats_verdict": None,
            "one_line_summary": None,
        }

explainability_service = ExplainabilityService()

