import logging
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel

from config.settings import settings
from services.parser_service import ParserService
from services.role_intelligence_service import RoleIntelligenceService
from services.semantic_matching_service import semantic_matcher
from services.prediction_service import PredictionService
from services.explainability_service import explainability_service
from services.optimization_service import OptimizationService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/full-analysis")
async def perform_full_analysis(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be PDF or DOCX.")
    
    # Loophole Fix: File size limit (5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB allowed.")
    await file.seek(0) # Reset to start for parser_service
        
    try:
        # Step 1: Parse Resume
        file_bytes = await file.read()
        parsed_resume = ParserService.parse_resume(file_bytes, file.filename)
        resume_dict = parsed_resume.model_dump()
        
        # Step 2: Role Intelligence Extraction
        role_data = RoleIntelligenceService.process_job_description(job_description)
        role_dict = role_data.model_dump()
        
        # Step 3: Semantic Matching
        semantic_result = semantic_matcher.compute_semantic_fit(resume_dict, role_dict)
        
        # Step 4: Shortlisting Prediction
        prediction_result = PredictionService.compute_shortlisting_probability(resume_dict, role_dict, semantic_result)
        
        # Step 5: Explainability Engine
        explanations = await explainability_service.generate_analysis_explanation(resume_dict, role_dict, semantic_result, prediction_result)
        
        # Compute missing skills mapping dynamically to ease frontend mapping
        resume_skills_lower = {s.lower() for s in resume_dict.get("skills", [])}
        missing_skills = [
            skill for skill in role_dict.get("required_skills", []) 
            if skill.lower() not in resume_skills_lower
        ]
        
        # Step 6: Resume Optimization Simulator
        # Calculate theoretical score improvements from targeted actions
        optimization_payload = await OptimizationService.simulate_resume_optimizations(resume_dict, role_dict, semantic_result)
        optimization_opportunities = optimization_payload.get("optimization_opportunities", [])
        
        return {
            "shortlisting_probability": prediction_result.get("shortlisting_probability", 0.0),
            "semantic_fit_score": semantic_result.get("semantic_fit_score", 0.0),
            "skills": resume_dict.get("skills", []),
            "missing_skills": missing_skills,
            "required_skills": role_dict.get("required_skills", []),
            "semantic_matches": semantic_result.get("matches", []),
            "strengths": explanations.get("strengths", []),
            "weaknesses": explanations.get("weaknesses", []),
            "suggestions": explanations.get("suggestions", []),
            "optimization_opportunities": optimization_opportunities,
            "warning": semantic_result.get("warning", None),
            "ats_verdict": explanations.get("ats_verdict"),
            "one_line_summary": explanations.get("one_line_summary"),
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

