import copy
import json
import logging
from typing import Dict, Any, List, Optional

from config.settings import settings
from prompts.templates import PROMPT_4_OPTIMIZATION
from services.prediction_service import PredictionService
from services.llm_client import call_llm

logger = logging.getLogger(__name__)


class OptimizationService:
    @classmethod
    async def _optimize_via_llm(
        cls,
        resume_json: Dict[str, Any],
        role_json: Dict[str, Any],
        semantic_result: Dict[str, Any],
        prediction_result: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """Prompt 4 — Resume Optimization Simulator via Groq/Claude."""
        analysis_json = {
            "resume": resume_json,
            "role": role_json,
            "semantic_result": semantic_result,
            "prediction_result": prediction_result,
        }
        
        prompt = PROMPT_4_OPTIMIZATION.replace(
            "{{ANALYSIS_JSON}}", json.dumps(analysis_json, default=str)
        ).replace(
            "{{ROLE_JSON}}", json.dumps(role_json, default=str)
        )
        
        try:
            out = await call_llm(prompt, temperature=0.3)
        except Exception as e:
            logger.warning(f"LLM optimization failed, falling back to heuristic: {e}")
            return None
            
        opportunities = out.get("optimization_opportunities") or []
        # Normalize to include action + score_increase for backward compat
        normalized = []
        for opp in opportunities[:5]:
            if isinstance(opp, dict):
                normalized.append({
                    "category": opp.get("category"),
                    "action": opp.get("action", ""),
                    "before_example": opp.get("before_example"),
                    "after_example": opp.get("after_example"),
                    "score_increase": opp.get("score_increase", 0.0),
                    "effort": opp.get("effort"),
                })
            else:
                normalized.append({"action": str(opp), "score_increase": 0.0})
        return {"optimization_opportunities": normalized}

    @classmethod
    async def simulate_resume_optimizations(
        cls, 
        resume_json: Dict[str, Any], 
        role_json: Dict[str, Any], 
        semantic_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate specific resume modifications to predict score improvements.
        Uses Groq/Claude when USE_LLM is enabled; otherwise runs heuristic logic.
        """
        prediction_result = PredictionService.compute_shortlisting_probability(
            resume_json, role_json, semantic_result
        )
        if settings.USE_LLM:
            result = await cls._optimize_via_llm(
                resume_json, role_json, semantic_result, prediction_result
            )
            if result is not None:
                return result

        # Get baseline prediction score (heuristic path)
        baseline_pred = prediction_result
        original_score = baseline_pred.get("shortlisting_probability", 0.0)

        opportunities = []
        
        # Helper inner function to quickly score simulated changes
        def get_score_increase(sim_resume, sim_semantic_result=None):
            s_result = sim_semantic_result if sim_semantic_result else semantic_result
            new_pred = PredictionService.compute_shortlisting_probability(sim_resume, role_json, s_result)
            return round(new_pred.get("shortlisting_probability", 0.0) - original_score, 4)
        
        # 1. Simulate Missing Skill Additions
        resume_skills_lower = {s.lower() for s in resume_json.get("skills", [])}
        missing_skills = [
            skill for skill in role_json.get("required_skills", []) 
            if skill.lower() not in resume_skills_lower
        ]
        
        for skill in missing_skills:
            sim_resume = copy.deepcopy(resume_json)
            if "skills" not in sim_resume:
                sim_resume["skills"] = []
            sim_resume["skills"].append(skill)
            
            increase = get_score_increase(sim_resume)
            if increase > 0:
                opportunities.append({
                    "action": f"Add {skill} skill",
                    "score_increase": increase
                })
                
        # 2. Simulate Achievement Quantification
        # Check if the baseline achievement score is poor (<= 0.5)
        baseline_ach = baseline_pred.get("score_breakdown", {}).get("achievement_strength", 0.0)
        if baseline_ach <= 0.6:
            sim_resume = copy.deepcopy(resume_json)
            if not sim_resume.get("experience"):
                sim_resume["experience"] = [{"bullets": []}]
            elif not sim_resume["experience"][0].get("bullets"):
                sim_resume["experience"][0]["bullets"] = []
                
            # Append a highly quantifiable heuristic trigger string
            sim_resume["experience"][0]["bullets"].append("improved performance by 50%")
            increase = get_score_increase(sim_resume)
            if increase > 0:
                opportunities.append({
                    "action": "Add quantified achievements (e.g. metrics, % improvements)",
                    "score_increase": increase
                })
                
        # 3. Simulate Project Emphasis
        # If semantic score is mediocre, but projects exist, simulate a 0.15 semantic boost
        baseline_semantic = semantic_result.get("semantic_fit_score", 0.0)
        has_projects = bool(resume_json.get("projects"))
        
        if baseline_semantic < 0.7 and has_projects:
            sim_semantic = copy.deepcopy(semantic_result)
            sim_semantic["semantic_fit_score"] = min(1.0, baseline_semantic + 0.15)
            
            increase = get_score_increase(resume_json, sim_semantic)
            if increase > 0:
                opportunities.append({
                    "action": "Highlight relevant keywords in project descriptions",
                    "score_increase": increase
                })
                
        # 4. Check formatting / ATS flags
        ats_score = baseline_pred.get("score_breakdown", {}).get("ats_compliance", 1.0)
        if ats_score < 1.0:
            sim_resume = copy.deepcopy(resume_json)
            sim_resume["skills"] = sim_resume.get("skills", ["Dummy Skill"])
            sim_resume["experience"] = sim_resume.get("experience", [{"role": "Dummy Role"}])
            sim_resume["education"] = sim_resume.get("education", [{"degree": "Dummy Degree"}])
            increase = get_score_increase(sim_resume)
            if increase > 0:
                opportunities.append({
                    "action": "Ensure standard formatting: include explicit Skills, Experience, and Education sections",
                    "score_increase": increase
                })
                
        # Rank by highest score increase, removing duplicates/0 impact
        opportunities.sort(key=lambda x: x["score_increase"], reverse=True)
        top_opportunities = opportunities[:3]
        
        return {
            "optimization_opportunities": top_opportunities
        }
