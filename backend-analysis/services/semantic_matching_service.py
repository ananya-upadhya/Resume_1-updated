# services/semantic_matching_service.py
"""
Layer 1 — Semantic Matching (LIGHTWEIGHT - TF-IDF)
Uses scikit-learn TfidfVectorizer to compute cosine similarity.
Optimized for Render's 512MB RAM limit.
No heavy sentence-transformers or PyTorch involved.
"""
import logging
import numpy as np
import re
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    _ML_AVAILABLE = True
except ImportError:
    TfidfVectorizer = None
    cosine_similarity = None
    _ML_AVAILABLE = False
    logger.warning("scikit-learn not installed. Semantic matching will return 0.0")


class SemanticMatchingService:
    """
    Local TF-IDF based semantic matcher.
    Extremely memory efficient compared to transformer models.
    """

    def __init__(self):
        self._vectorizer = TfidfVectorizer(stop_words='english')

    @staticmethod
    def _split_sentences(text: str, max_sentences: int = 30) -> List[str]:
        """Split text into meaningful sentences, skip very short ones."""
        raw = re.split(r"(?<=[.!?])\s+|\n", text)
        sentences = [s.strip() for s in raw if len(s.strip().split()) >= 3]
        return sentences[:max_sentences]

    def compute_semantic_fit(
        self, resume_json: Dict[str, Any], role_json: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Compute similarity using TF-IDF and Cosine Similarity.
        Return overall semantic_fit_score + top 5 matches.
        """
        if not _ML_AVAILABLE:
            logger.warning("ML libraries unavailable — returning zero semantic score.")
            return {"semantic_fit_score": 0.0, "matches": []}

        raw_text: str = resume_json.get("raw_text", "")
        responsibilities: List[str] = role_json.get("responsibilities", [])

        # Build candidate sentence lists
        resume_sentences = self._split_sentences(raw_text)
        if not resume_sentences:
            # Flatten experience bullets as fallback
            for exp in resume_json.get("experience", []):
                resume_sentences.extend(exp.get("bullets", []))
        if not resume_sentences:
            resume_sentences = ["No resume content available."]

        if not responsibilities:
            # Use required skills as pseudo-responsibilities
            skills = role_json.get("required_skills", [])
            responsibilities = [f"Experience with {s}" for s in skills[:8]] or [
                "General software engineering skills"
            ]

        try:
            # Combine all text to fit the vectorizer
            all_corpus = resume_sentences + responsibilities
            tfidf_matrix = self._vectorizer.fit_transform(all_corpus)
            
            # Split matrix back into resume and role parts
            resume_tfidf = tfidf_matrix[:len(resume_sentences)]
            role_tfidf = tfidf_matrix[len(resume_sentences):]

            # Compute similarity matrix [n_resume_sents × n_responsibilities]
            sim_matrix = cosine_similarity(resume_tfidf, role_tfidf)

            # Overall fit = mean of best match for each responsibility
            per_resp_max = np.max(sim_matrix, axis=0)
            overall_fit = float(np.mean(per_resp_max))

            # Build top-5 individual match pairs
            pairs = []
            for r_idx, r_sent in enumerate(resume_sentences):
                for j_idx, j_req in enumerate(responsibilities):
                    pairs.append((
                        float(sim_matrix[r_idx, j_idx]),
                        r_sent,
                        j_req,
                    ))
            pairs.sort(key=lambda x: x[0], reverse=True)

            # Deduplicate — each resume sentence and each requirement appears at most once
            seen_resume, seen_role = set(), set()
            top_matches = []
            for score, r_sent, j_req in pairs:
                if score < 0.10: # Lower threshold for TF-IDF since it's more sparse
                    break
                if r_sent in seen_resume or j_req in seen_role:
                    continue
                seen_resume.add(r_sent)
                seen_role.add(j_req)
                top_matches.append({
                    "resume_sentence": r_sent,
                    "job_requirement": j_req,
                    "similarity": round(score, 4),
                })
                if len(top_matches) == 5:
                    break

            return {
                "semantic_fit_score": round(min(1.0, max(0.0, overall_fit * 1.5)), 4), # Boost TF-IDF scores slightly for UX
                "matches": top_matches,
            }
        except Exception as e:
            logger.error(f"Semantic matching failed: {e}")
            return {"semantic_fit_score": 0.0, "matches": []}


# Module-level singleton
semantic_matcher = SemanticMatchingService()
