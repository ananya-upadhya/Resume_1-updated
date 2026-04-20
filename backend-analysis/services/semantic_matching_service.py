# services/semantic_matching_service.py
"""
Layer 1 — Semantic Matching (PURE LOCAL, no LLM calls)
Uses sentence-transformers MiniLM (all-MiniLM-L6-v2) loaded locally
to compute cosine similarity between resume sentences and job responsibilities.
Model loads once on first use and is reused across requests.
"""
import logging
import numpy as np
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    import torch
    torch.set_num_threads(1)
    _TRANSFORMERS_AVAILABLE = True
except ImportError:
    SentenceTransformer = None
    cosine_similarity = None
    _TRANSFORMERS_AVAILABLE = False
    logger.warning("sentence-transformers or scikit-learn not installed. Semantic matching will return 0.0")


class SemanticMatchingService:
    """
    Local MiniLM-based semantic matcher.
    No LLM calls — all inference is on-device using sentence-transformers.
    """

    def __init__(self):
        self._model = None

    def _load_model(self):
        if self._model is None and _TRANSFORMERS_AVAILABLE:
            logger.info("Loading MiniLM model (all-MiniLM-L6-v2)…")
            self._model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("MiniLM model loaded.")

    @staticmethod
    def _split_sentences(text: str, max_sentences: int = 30) -> List[str]:
        """Split text into meaningful sentences, skip very short ones."""
        import re
        raw = re.split(r"(?<=[.!?])\s+|\n", text)
        sentences = [s.strip() for s in raw if len(s.strip().split()) >= 4]
        return sentences[:max_sentences]

    def compute_semantic_fit(
        self, resume_json: Dict[str, Any], role_json: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Encode resume sentences and job responsibilities with MiniLM.
        Return overall semantic_fit_score + top 5 matches by cosine similarity.
        """
        self._load_model()

        if not self._model:
            logger.warning("MiniLM unavailable — returning zero semantic score.")
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

        # Encode both sides
        resume_embeddings = self._model.encode(resume_sentences, show_progress_bar=False)
        role_embeddings = self._model.encode(responsibilities, show_progress_bar=False)

        # Compute full similarity matrix  [n_resume_sents × n_responsibilities]
        sim_matrix = cosine_similarity(resume_embeddings, role_embeddings)

        # Overall fit = mean of top-k maximum similarities per responsibility
        per_resp_max = np.max(sim_matrix, axis=0)             # best resume match for each responsibility
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
            if score < 0.20:
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
            "semantic_fit_score": round(min(1.0, max(0.0, overall_fit)), 4),
            "matches": top_matches,
        }


# Module-level singleton — model loaded once at first request
semantic_matcher = SemanticMatchingService()
