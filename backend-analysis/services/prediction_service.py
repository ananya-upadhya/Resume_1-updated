# services/prediction_service.py
import re
from typing import Dict, Any, List

class PredictionService:
    @staticmethod
    def _extract_required_years(exp_level: str) -> float:
        if not exp_level or exp_level.lower() == "not specified": return 0.0
        matches = re.findall(r'(\d+)', exp_level)
        return float(matches[0]) if matches else 0.0

    @staticmethod
    def _extract_resume_years(experience_entries: List[Dict[str, Any]]) -> float:
        current_year = 2026
        all_years = []
        for entry in experience_entries:
            text = f"{entry.get('role', '')} {entry.get('company', '')} {' '.join(entry.get('bullets', []))}"
            years = re.findall(r'\b(19\d{2}|20\d{2})\b', text)
            all_years.extend([int(y) for y in years])
            if "present" in text.lower() or "current" in text.lower(): all_years.append(current_year)
        if all_years: return float(max(all_years) - min(all_years))
        return float(len(experience_entries) * 2.0)

    @staticmethod
    def _calculate_experience_score(resume_years: float, required_years: float) -> float:
        if required_years == 0: return 1.0
        if resume_years >= required_years: return 1.0
        elif resume_years >= required_years - 2.0: return 0.5
        return 0.2

    @staticmethod
    def _calculate_skill_match_score(resume_skills: List[str], role_skills: List[str]) -> float:
        if not role_skills: return 1.0
        resume_lower = [s.lower() for s in resume_skills]
        role_lower = [s.lower() for s in role_skills]
        matched = sum(1 for req in role_lower if any(req in r or r in req for r in resume_lower))
        return min(1.0, float(matched) / len(role_skills))

    @staticmethod
    def _calculate_achievement_score(experience_entries: List[Dict[str, Any]]) -> float:
        patterns = [r"%", r"\bimproved\b", r"\bincreased\b", r"\breduced\b", r"\boptimized\b"]
        regex = re.compile("|".join(patterns), re.IGNORECASE)
        for entry in experience_entries:
            for bullet in entry.get("bullets", []):
                if regex.search(bullet): return 0.9
        return 0.3

    @staticmethod
    def _calculate_ats_score(resume_json: Dict[str, Any]) -> float:
        score = 1.0
        if not resume_json.get("skills"): score -= 0.333
        if not resume_json.get("experience"): score -= 0.333
        if not resume_json.get("education"): score -= 0.333
        return max(0.0, score)

    @classmethod
    def compute_shortlisting_probability(cls, resume_json: Dict[str, Any], role_json: Dict[str, Any], semantic_result: Dict[str, Any]) -> Dict[str, Any]:
        semantic_fit = float(semantic_result.get("semantic_fit_score", 0.0))
        skill_match_score = cls._calculate_skill_match_score(resume_json.get("skills", []), role_json.get("required_skills", []))
        req_years = cls._extract_required_years(role_json.get("experience_level", ""))
        res_years = cls._extract_resume_years(resume_json.get("experience", []))
        experience_score = cls._calculate_experience_score(res_years, req_years)
        achievement_score = cls._calculate_achievement_score(resume_json.get("experience", []))
        ats_score = cls._calculate_ats_score(resume_json)
        
        shortlisting_score = (0.35 * semantic_fit + 0.25 * skill_match_score + 0.20 * experience_score + 0.10 * achievement_score + 0.10 * ats_score)
        
        return {
            "shortlisting_probability": round(min(1.0, max(0.0, shortlisting_score)), 4),
            "score_breakdown": {
                "semantic_fit": round(semantic_fit, 4),
                "skill_match": round(skill_match_score, 4),
                "experience_relevance": round(experience_score, 4),
                "achievement_strength": round(achievement_score, 4),
                "ats_compliance": round(ats_score, 4)
            }
        }
