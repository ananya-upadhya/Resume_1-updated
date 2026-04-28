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
        """
        Calculates total experience based on structured dates if possible, 
        fallback to 1.5 years per entry if dates are missing/unparseable.
        """
        if not experience_entries:
            return 0.0
            
        total_years = 0.0
        for entry in experience_entries:
            text = f"{entry.get('role', '')} {entry.get('company', '')} {' '.join(entry.get('bullets', []))}"
            # Find year ranges like 2018 - 2021 or 2020 - Present
            ranges = re.findall(r'\b(20\d{2}|19\d{2})\b\s*(?:-|to)\s*\b(20\d{2}|19\d{2}|present|current)\b', text, re.IGNORECASE)
            if ranges:
                for start, end in ranges:
                    try:
                        start_yr = int(start)
                        end_yr = 2026 if end.lower() in ['present', 'current'] else int(end)
                        if end_yr >= start_yr:
                            total_years += (end_yr - start_yr)
                    except ValueError:
                        pass
            else:
                # If no explicit ranges found, assume 1.5 years per role
                total_years += 1.5

        return float(total_years)

    @staticmethod
    def _calculate_experience_score(resume_years: float, required_years: float) -> float:
        if required_years == 0: return 1.0
        if resume_years >= required_years: return 1.0
        elif resume_years >= required_years - 1.0: return 0.8
        elif resume_years >= required_years - 2.0: return 0.5
        elif resume_years > 0: return 0.3
        return 0.1

    @staticmethod
    def _calculate_skill_match_score(resume_json: Dict[str, Any], role_skills: List[str]) -> float:
        if not role_skills: return 1.0
        
        explicit_skills = " ".join(resume_json.get("skills", [])).lower()
        raw_text = resume_json.get("raw_text", "").lower()
        search_corpus = f"{explicit_skills} {raw_text}"
        
        matched = 0
        for req in role_skills:
            req_lower = req.lower().strip()
            if not req_lower: continue
            
            escaped_req = re.escape(req_lower)
            if re.match(r'^[a-z0-9\s]+$', req_lower):
                pattern = rf"\b{escaped_req}\b"
            else:
                pattern = rf"(?:\s|[.,/!?-]|^){escaped_req}(?:\s|[.,/!?-]|$)"
                
            if re.search(pattern, search_corpus):
                matched += 1
                
        return min(1.0, float(matched) / len(role_skills))

    @staticmethod
    def _calculate_achievement_score(experience_entries: List[Dict[str, Any]]) -> float:
        if not experience_entries:
            return 0.0
            
        patterns = [
            r"%", r"\b\d+\+?\b", r"\$\d+", 
            r"\bimproved\b", r"\bincreased\b", r"\breduced\b", r"\boptimized\b", 
            r"\bmaximized\b", r"\bdecreased\b", r"\bsaved\b", r"\bgenerated\b",
            r"\baccelerated\b", r"\bstreamlined\b", r"\bengineered\b", r"\bspearheaded\b"
        ]
        regex = re.compile("|".join(patterns), re.IGNORECASE)
        
        total_bullets = 0
        strong_bullets = 0
        
        for entry in experience_entries:
            bullets = entry.get("bullets", [])
            total_bullets += len(bullets)
            for bullet in bullets:
                if regex.search(bullet):
                    strong_bullets += 1
                    
        if total_bullets == 0:
            return 0.3 
            
        ratio = strong_bullets / total_bullets
        score = min(1.0, 0.4 + (ratio * 1.2)) 
        return round(score, 4)

    @staticmethod
    def _calculate_ats_score(resume_json: Dict[str, Any]) -> float:
        score = 0.0
        
        # 1. Essential Sections (Max 0.4)
        if resume_json.get("skills") and len(resume_json["skills"]) > 0: score += 0.15
        if resume_json.get("experience") and len(resume_json["experience"]) > 0: score += 0.15
        if resume_json.get("education") and len(resume_json["education"]) > 0: score += 0.10
        
        # 2. Contact Information (Max 0.3)
        contact = resume_json.get("contact", {})
        if contact.get("email"): score += 0.15
        if contact.get("phone"): score += 0.10
        if contact.get("linkedin") or contact.get("github") or contact.get("portfolio"): score += 0.05
        
        # 3. Content Formatting & Length (Max 0.3)
        raw_text = resume_json.get("raw_text", "")
        word_count = len(raw_text.split())
        
        if 250 <= word_count <= 1200:
            score += 0.15
        elif 100 < word_count < 250 or 1200 < word_count < 1500:
            score += 0.05
            
        bullets_count = len(re.findall(r'(?:^|\n)\s*[-•*]', raw_text))
        if bullets_count >= 3:
            score += 0.15
            
        return min(1.0, max(0.0, score))

    @classmethod
    def compute_shortlisting_probability(cls, resume_json: Dict[str, Any], role_json: Dict[str, Any], semantic_result: Dict[str, Any]) -> Dict[str, Any]:
        semantic_fit = float(semantic_result.get("semantic_fit_score", 0.0))
        skill_match_score = cls._calculate_skill_match_score(resume_json, role_json.get("required_skills", []))
        req_years = cls._extract_required_years(role_json.get("experience_level", ""))
        res_years = cls._extract_resume_years(resume_json.get("experience", []))
        experience_score = cls._calculate_experience_score(res_years, req_years)
        achievement_score = cls._calculate_achievement_score(resume_json.get("experience", []))
        ats_score = cls._calculate_ats_score(resume_json)
        
        shortlisting_score = (0.35 * semantic_fit + 0.30 * skill_match_score + 0.15 * experience_score + 0.10 * achievement_score + 0.10 * ats_score)
        
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
