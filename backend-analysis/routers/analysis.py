import logging
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Request, Body
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

# Schema for JSON fallback
class AnalyzeRequest(BaseModel):
    resume_text: Optional[str] = None
    role: Optional[str] = None
    job_description: Optional[str] = None

@router.post("/analyze")
async def analyze_resume(
    request: Request,
    file: Optional[UploadFile] = File(None),
    role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None)
):
    """
    Unified analysis endpoint.
    Accepts:
    1. Multipart (file + role + job_description)
    2. JSON (resume_text + role + job_description)
    """
    final_role = role or ""
    final_jd = job_description or ""
    final_text = None
    
    # 1. Handle JSON Body Fallback
    if "application/json" in request.headers.get("content-type", ""):
        try:
            data = await request.json()
            if not final_role: final_role = data.get("role", "")
            if not final_jd: final_jd = data.get("job_description", "")
            final_text = data.get("resume_text")
        except:
            pass

    try:
        # 2. Get Parsed Resume (either from file or text)
        if file:
            # Step 1: Parse Resume from File
            file_bytes = await file.read()
            parsed_resume = ParserService.parse_resume(file_bytes, file.filename)
        elif final_text:
            # Step 1: Parse Resume from provided text
            parsed_resume = ParserService.parse_text(final_text)
        else:
            raise HTTPException(status_code=400, detail="No resume provided. Upload a file or provide resume_text.")

        resume_dict = parsed_resume.model_dump()
        
        # Step 2: Role Intelligence Extraction
        # Merge role and JD for context
        context = f"Role: {final_role}\n\nJD: {final_jd}"
        role_data = RoleIntelligenceService.process_job_description(context)
        role_dict = role_data.model_dump()
        
        # Step 3: Semantic Matching
        semantic_result = semantic_matcher.compute_semantic_fit(resume_dict, role_dict)
        
        # Step 4: Shortlisting Prediction
        prediction_result = PredictionService.compute_shortlisting_probability(resume_dict, role_dict, semantic_result)
        
        # Step 5: Explainability Engine
        explanations = explainability_service.generate_analysis_explanation(resume_dict, role_dict, semantic_result, prediction_result)
        
        # Compute missing skills mapping dynamically to ease frontend mapping
        resume_skills_lower = {s.lower() for s in resume_dict.get("skills", [])}
        missing_skills = [
            skill for skill in role_dict.get("required_skills", []) 
            if skill.lower() not in resume_skills_lower
        ]
        
        # Step 6: Resume Optimization Simulator
        optimization_payload = OptimizationService.simulate_resume_optimizations(resume_dict, role_dict, semantic_result)
        optimization_opportunities = optimization_payload.get("optimization_opportunities", [])
        
        return {
            "shortlisting_probability": prediction_result.get("shortlisting_probability", 0.0),
            "semantic_fit_score": semantic_result.get("semantic_fit_score", 0.0),
            "ats_score": prediction_result.get("score_breakdown", {}).get("ats_compliance", 0.0),
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

    except ValueError as ve:
        # Handle the specific "image-based" error
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Maintain old endpoint name for compatibility if needed, aliased to new logic
@router.post("/full-analysis")
async def perform_full_analysis(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    return await analyze_resume(Request({"type": "http"}), file=file, job_description=job_description)

