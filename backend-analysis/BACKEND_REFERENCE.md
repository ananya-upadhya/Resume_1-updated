# Resume Intelligence Backend — Full Reference

This document contains the **complete file structure** and **full contents** of every backend file.

---

## File structure

```
resume-intelligence/backend/
├── main.py                    # FastAPI app entry, CORS, router registration
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variable template
├── debug_flow.py              # Local pipeline debug script (parse → role → semantic)
├── test_resume.txt            # Sample resume text for testing
├── test_role_intelligence.py  # HTTP tests for /api/role-intelligence
├── test_explainability.py      # Unit test for explainability service
├── test_prediction_engine.py  # Unit test for prediction service
├── test_semantic_matching.py  # Unit test for semantic matching
├── config/
│   └── settings.py            # Pydantic settings (PROJECT_NAME, VERSION, API_V1_STR)
├── routers/
│   ├── __init__.py
│   ├── system.py              # GET /health, GET /api/version
│   ├── analysis.py            # POST /api/full-analysis (main pipeline)
│   ├── resume_parser.py       # POST /api/parse-resume
│   ├── role_intelligence.py  # POST /api/role-intelligence
│   ├── semantic_matching.py   # POST /api/semantic-match
│   ├── prediction_router.py  # POST /api/predict-shortlisting
│   ├── explainability_router.py # POST /api/explain-analysis
│   └── optimization_router.py  # POST /api/optimize-resume
├── schemas/
│   ├── __init__.py
│   ├── analysis.py            # AnalysisResponse, StrengthData, SkillMatchData
│   ├── resume_schema.py       # ParsedResume, ParseResponse, ExperienceItem, etc.
│   ├── role_schema.py         # RoleInput, RoleData, RoleResponse
│   ├── semantic_schema.py     # SemanticMatchRequest, SemanticMatchResponse, SemanticMatchDetail
│   ├── prediction_schema.py   # PredictionRequest, PredictionResponse, ScoreBreakdown
│   └── explainability_schema.py # ExplainabilityRequest, ExplainabilityResponse
└── services/
    ├── parser_service.py           # PDF/DOCX → text, extract skills/experience/education/projects
    ├── role_intelligence_service.py # Job description → role, skills, tools, experience_level, responsibilities
    ├── semantic_matching_service.py # Sentence embeddings + cosine similarity (resume vs role)
    ├── prediction_service.py      # Shortlisting probability + score breakdown
    ├── explainability_service.py   # Strengths, weaknesses, suggestions from analysis
    └── optimization_service.py     # Simulate resume changes → score increase opportunities
```

---

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/version` | API version |
| POST | `/api/full-analysis` | Upload resume + job description → full analysis (parse, role, semantic, prediction, explainability, optimization) |
| POST | `/api/parse-resume` | Upload PDF/DOCX → parsed resume JSON |
| POST | `/api/role-intelligence` | Job description → role data (skills, tools, responsibilities, etc.) |
| POST | `/api/semantic-match` | resume_json + role_json → semantic fit score + top matches |
| POST | `/api/predict-shortlisting` | resume + role + semantic_result → shortlisting probability + score breakdown |
| POST | `/api/explain-analysis` | resume + role + semantic + prediction → strengths, weaknesses, suggestions |
| POST | `/api/optimize-resume` | resume + role + prediction/semantic → optimization opportunities |

---

## 1. Root & config

### `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import system, analysis, resume_parser, role_intelligence, semantic_matching, prediction_router, explainability_router, optimization_router
from config.settings import settings
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(system.router, tags=["System"])
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])
app.include_router(resume_parser.router, prefix="/api", tags=["Resume Parser"])
app.include_router(role_intelligence.router, prefix="/api", tags=["Role Intelligence"])
app.include_router(semantic_matching.router, prefix="/api", tags=["Semantic Matching"])
app.include_router(prediction_router.router, prefix="/api", tags=["Prediction"])
app.include_router(explainability_router.router, prefix="/api", tags=["Explainability"])
app.include_router(optimization_router.router, prefix="/api", tags=["Optimization"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

### `requirements.txt`

```
fastapi>=0.110.0
uvicorn[standard]>=0.29.0
pydantic>=2.6.4
pydantic-settings>=2.2.1
python-dotenv>=1.0.1
sqlmodel>=0.0.16
sqlalchemy>=2.0.28
python-multipart>=0.0.9
sentence-transformers>=2.5.0
scikit-learn>=1.4.0
numpy>=1.26.0
```

### `.env.example`

```
PROJECT_NAME="Resume Intelligence API"
VERSION="0.1.0"
API_V1_STR="/api/v1"

# Database Configuration (Placeholder for future)
# DATABASE_URL="postgresql://user:password@localhost:5432/resume_db"
```

### `config/settings.py`

```python
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume Intelligence API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # Database settings
    # DATABASE_URL: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
```

---

## 2. Routers

### `routers/__init__.py`

```python
# Init module
```

### `routers/system.py`

```python
from fastapi import APIRouter
from config.settings import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/api/version")
async def api_version():
    return {"version": settings.VERSION}
```

### `routers/analysis.py`

```python
import asyncio
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from schemas.analysis import AnalysisResponse

from services.parser_service import ParserService
from services.role_intelligence_service import RoleIntelligenceService
from services.semantic_matching_service import semantic_matcher
from services.prediction_service import PredictionService
from services.explainability_service import explainability_service
from services.optimization_service import OptimizationService

router = APIRouter()

@router.post("/full-analysis")
async def perform_full_analysis(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be PDF or DOCX.")
        
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
            "skills": resume_dict.get("skills", []),
            "missing_skills": missing_skills,
            "semantic_matches": semantic_result.get("matches", []),
            "strengths": explanations.get("strengths", []),
            "weaknesses": explanations.get("weaknesses", []),
            "suggestions": explanations.get("suggestions", []),
            "optimization_opportunities": optimization_opportunities,
            "warning": semantic_result.get("warning", None)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
```

### `routers/resume_parser.py`

```python
from fastapi import APIRouter, File, UploadFile, HTTPException
from schemas.resume_schema import ParseResponse, ParsedResume
from services.parser_service import ParserService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/parse-resume", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")
        
    try:
        contents = await file.read()
        
        if not contents:
            raise HTTPException(status_code=400, detail="File is empty")
            
        parsed_resume_data = ParserService.parse_resume(contents, file.filename)
        
        return ParseResponse(
            status="success",
            parsed_resume=parsed_resume_data
        )
        
    except ValueError as ve:
        logger.error(f"Validation error parsing resume: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error parsing resume: {e}", exc_info=True)
        return ParseResponse(
            status="error",
            message="Unable to parse resume"
        )
```

### `routers/role_intelligence.py`

```python
from fastapi import APIRouter, HTTPException
from schemas.role_schema import RoleInput, RoleResponse
from services.role_intelligence_service import RoleIntelligenceService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/role-intelligence", response_model=RoleResponse)
async def process_role_intelligence(input_data: RoleInput):
    if not input_data.job_description or not input_data.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")
        
    try:
        role_data = RoleIntelligenceService.process_job_description(input_data.job_description)
        
        return RoleResponse(
            status="success",
            role_data=role_data
        )
        
    except Exception as e:
        logger.error(f"Error processing job description: {e}", exc_info=True)
        return RoleResponse(
            status="error",
            message="Unable to parse job description"
        )
```

### `routers/semantic_matching.py`

```python
from fastapi import APIRouter, HTTPException, status
from schemas.semantic_schema import SemanticMatchRequest, SemanticMatchResponse
from services.semantic_matching_service import semantic_matcher
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/semantic-match", response_model=SemanticMatchResponse)
async def semantic_match(request: SemanticMatchRequest):
    try:
        if not request.resume_json:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"status": "error", "message": "Missing resume_json"}
            )
            
        if not request.role_json:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"status": "error", "message": "Missing role_json"}
            )

        result = semantic_matcher.compute_semantic_fit(
            request.resume_json, 
            request.role_json
        )
        
        if result.get("status") == "warning":
            return SemanticMatchResponse(
                semantic_fit_score=0.0,
                matches=[],
            )

        return SemanticMatchResponse(
            semantic_fit_score=result["semantic_fit_score"],
            matches=result["matches"]
        )
        
    except ValueError as ve:
        logger.warning(f"Semantic match data error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "error", "message": str(ve)}
        )
    except Exception as e:
        logger.error(f"Semantic comparison failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"status": "error", "message": "Internal processing error during semantic match."}
        )
```

### `routers/prediction_router.py`

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from schemas.prediction_schema import PredictionRequest, PredictionResponse
from services.prediction_service import PredictionService

router = APIRouter()

@router.post("/predict-shortlisting", response_model=PredictionResponse)
async def predict_shortlisting(request: PredictionRequest):
    if not request.resume_json:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid input for prediction engine"})
    if not request.role_json:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid input for prediction engine"})
    if not request.semantic_result:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid input for prediction engine"})

    try:
        result = PredictionService.compute_shortlisting_probability(
            request.resume_json,
            request.role_json,
            request.semantic_result
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### `routers/explainability_router.py`

```python
from fastapi import APIRouter, HTTPException, status
from schemas.explainability_schema import ExplainabilityRequest, ExplainabilityResponse
from services.explainability_service import explainability_service
import logging
import time

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/explain-analysis", response_model=ExplainabilityResponse)
async def explain_analysis(request: ExplainabilityRequest):
    try:
        if not request.resume_json or not request.role_json:
            raise ValueError("Missing resume_json or role_json")
        if not request.semantic_result or not request.prediction_result:
             raise ValueError("Missing semantic_result or prediction_result")
             
        start_time = time.time()
        
        result = explainability_service.generate_analysis_explanation(
            request.resume_json,
            request.role_json,
            request.semantic_result,
            request.prediction_result
        )
        
        end_time = time.time()
        logger.debug(f"Explainability engine executed in {(end_time - start_time) * 1000:.2f} ms")
        
        return ExplainabilityResponse(
            strengths=result["strengths"],
            weaknesses=result["weaknesses"],
            suggestions=result["suggestions"]
        )
        
    except ValueError as ve:
        logger.warning(f"Explainability request validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "error", "message": str(ve)}
        )
    except Exception as e:
        logger.error(f"Generate explanation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"status": "error", "message": "Internal error occurred explaining analysis."}
        )
```

### `routers/optimization_router.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List

from services.optimization_service import OptimizationService

router = APIRouter()

class OptimizationRequest(BaseModel):
    resume_json: Dict[str, Any]
    role_json: Dict[str, Any]
    prediction_result: Dict[str, Any]

@router.post("/optimize-resume")
async def optimize_resume(req: OptimizationRequest):
    opportunities = OptimizationService.simulate_resume_optimizations(
        resume_json=req.resume_json,
        role_json=req.role_json,
        semantic_result=req.prediction_result
    )
    return opportunities
```

---

## 3. Schemas

### `schemas/__init__.py`

```python
# Init file
```

### `schemas/analysis.py`

```python
from pydantic import BaseModel
from typing import List

class StrengthData(BaseModel):
    name: str
    score: int

class SkillMatchData(BaseModel):
    subject: str
    A: int
    fullMark: int

class AnalysisResponse(BaseModel):
    status: str
    match_probability: int
    strength_data: List[StrengthData]
    skill_match_data: List[SkillMatchData]
    missing_skills: List[str]
```

### `schemas/resume_schema.py`

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class ExperienceItem(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)

class EducationItem(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None

class ProjectItem(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ParsedResume(BaseModel):
    skills: List[str] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    raw_text: Optional[str] = None

class ParseResponse(BaseModel):
    status: str
    message: Optional[str] = None
    parsed_resume: Optional[ParsedResume] = None
```

### `schemas/role_schema.py`

```python
from pydantic import BaseModel
from typing import List, Optional

class RoleInput(BaseModel):
    job_description: str

class RoleData(BaseModel):
    role: str
    required_skills: List[str]
    tools: List[str]
    experience_level: str
    responsibilities: List[str]

class RoleResponse(BaseModel):
    status: str
    role_data: Optional[RoleData] = None
```

### `schemas/semantic_schema.py`

```python
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SemanticMatchDetail(BaseModel):
    resume_sentence: str = Field(description="The specific sentence from the resume")
    job_requirement: str = Field(description="The matched sentence from the job description")
    similarity: float = Field(description="Cosine similarity score for this match", ge=0.0, le=1.0)

class SemanticMatchRequest(BaseModel):
    resume_json: Dict[str, Any] = Field(description="Parsed resume structure from Stage 3")
    role_json: Dict[str, Any] = Field(description="Parsed job role structure from Stage 4")

class SemanticMatchResponse(BaseModel):
    semantic_fit_score: float = Field(description="Overall semantic compatibility score", ge=0.0, le=1.0)
    matches: List[SemanticMatchDetail] = Field(description="Top matched pairs between resume and role")
```

### `schemas/prediction_schema.py`

```python
from pydantic import BaseModel, Field
from typing import Dict, Any

class ScoreBreakdown(BaseModel):
    semantic_fit: float = Field(description="Semantic fit score from Stage 5", ge=0.0, le=1.0)
    skill_match: float = Field(description="Score based on matching skills between resume and role", ge=0.0, le=1.0)
    experience_relevance: float = Field(description="Score based on years of experience compared to role requirements", ge=0.0, le=1.0)
    achievement_strength: float = Field(description="Score based on presence of quantified achievements in experience bullets", ge=0.0, le=1.0)
    ats_compliance: float = Field(description="Score based on presence of key resume sections (skills, experience, education)", ge=0.0, le=1.0)

class PredictionRequest(BaseModel):
    resume_json: Dict[str, Any] = Field(description="Parsed resume structure from Stage 3")
    role_json: Dict[str, Any] = Field(description="Parsed job role structure from Stage 4")
    semantic_result: Dict[str, Any] = Field(description="Semantic matching result from Stage 5")

class PredictionResponse(BaseModel):
    shortlisting_probability: float = Field(description="Final normalized shortlisting probability score", ge=0.0, le=1.0)
    score_breakdown: ScoreBreakdown = Field(description="Detailed breakdown of the scoring signals")
```

### `schemas/explainability_schema.py`

```python
from pydantic import BaseModel, Field
from typing import List, Dict, Any

class ExplainabilityRequest(BaseModel):
    resume_json: Dict[str, Any] = Field(description="Parsed resume structure from Stage 3")
    role_json: Dict[str, Any] = Field(description="Parsed job role structure from Stage 4")
    semantic_result: Dict[str, Any] = Field(description="Semantic matching result from Stage 5")
    prediction_result: Dict[str, Any] = Field(description="Prediction result from Stage 6")

class ExplainabilityResponse(BaseModel):
    strengths: List[str] = Field(default_factory=list, description="List of strengths identified in the resume")
    weaknesses: List[str] = Field(default_factory=list, description="List of weaknesses or gaps identified in the resume")
    suggestions: List[str] = Field(default_factory=list, description="List of actionable suggestions for improvement")
```

---

## 4. Services

(Full service file contents are large; summaries and key interfaces below.)

### `services/parser_service.py` — Summary

- **Dependencies:** `re`, `io`, `spacy`, `pdfplumber`, `docx`
- **SKILL_DICTIONARY:** Set of tech skills for matching.
- **Methods:**
  - `extract_text_from_pdf(file_bytes)` → raw text
  - `extract_text_from_docx(file_bytes)` → raw text
  - `clean_text(text)` → normalized text
  - `extract_skills(text)` → list of skills (from dictionary + spaCy)
  - `extract_experience(text)` → list of `ExperienceItem` (section detection, bullets, role/company)
  - `extract_education(text)` → list of `EducationItem`
  - `extract_projects(text)` → list of `ProjectItem`
  - `parse_resume(file_bytes, filename)` → `ParsedResume` (PDF/DOCX only; fallback sentence extraction if no experience bullets)

### `services/role_intelligence_service.py` — Summary

- **Dependencies:** `re`, `spacy`, `schemas.role_schema.RoleData`
- **Dictionaries:** `SKILLS_DICTIONARY`, `TOOLS_DICTIONARY`, `ACTION_VERBS`
- **Methods:** `clean_text`, `extract_role`, `extract_skills`, `extract_tools`, `extract_experience`, `extract_responsibilities`
- **Entry:** `process_job_description(text)` → `RoleData` (role, required_skills, tools, experience_level, responsibilities)

### `services/semantic_matching_service.py` — Summary

- **Dependencies:** `sentence_transformers.SentenceTransformer`, `sklearn.metrics.pairwise.cosine_similarity`, `numpy`
- **Model:** Lazy-loaded `all-MiniLM-L6-v2`
- **Logic:** Collect resume sentences (experience bullets, project descriptions, fallback raw_text); collect role sentences (responsibilities or required_skills); encode both; cosine similarity matrix; top 5 matches (threshold 0.3); mean of best scores → `semantic_fit_score`. Returns `{"status": "warning", ...}` if insufficient data.

### `services/prediction_service.py` — Summary

- **Logic:** No external model. Uses:
  - `semantic_fit` from semantic result
  - `skill_match`: fraction of role skills found in resume
  - `experience_relevance`: resume years vs required years (regex on experience_level and experience entries)
  - `achievement_strength`: regex for %, "improved", "increased", etc. in bullets
  - `ats_compliance`: penalties for missing skills, experience, education
- **Formula:** `0.35*semantic_fit + 0.25*skill_match + 0.20*experience + 0.10*achievement + 0.10*ats`
- **Returns:** `{ "shortlisting_probability": float, "score_breakdown": { ... } }`

### `services/explainability_service.py` — Summary

- **Input:** resume_json, role_json, semantic_result, prediction_result
- **Output:** `{ "strengths": [], "weaknesses": [], "suggestions": [] }` based on semantic score, skill overlap, achievement score, experience score, ATS compliance.

### `services/optimization_service.py` — Summary

- **Input:** resume_json, role_json, semantic_result
- **Logic:** Baseline prediction; simulate adding missing skills, adding quantified achievement bullet, boosting semantic if projects exist, fixing ATS sections; compute score deltas; return top 3 `optimization_opportunities` (action + score_increase).

---

## 5. Tests & debug

### `test_resume.txt`

```
John Doe
Senior Software Engineer
New York, NY | john.doe@email.com

SUMMARY
Experienced software engineer with a focus on web development, scalable backends, and cloud infrastructure.

SKILLS
Python, JavaScript, React, Node.js, AWS, Docker, SQL, Kubernetes

EXPERIENCE
Tech Corp Inc.
Senior Backend Engineer
2020 - Present
- Built microservices using Python and FastAPI
- Deployed applications to Kubernetes on AWS
- Improved database query performance by 40%

Web Solutions LLC
Frontend Developer
2018 - 2020
- Developed responsive SPAs using React
- Implemented state management with Redux
- Collaborated with UX designers to improve accessibility

EDUCATION
Bachelor of Science in Computer Science
State University
2014 - 2018
```

### `debug_flow.py`

- Reads `test_resume.txt` as raw text, runs `ParserService.extract_skills/extract_experience/extract_education`, builds `resume_json`.
- Runs `RoleIntelligenceService.process_job_description` on a hardcoded JD → `role_json`.
- Instantiates `SemanticMatchingService()` and calls `compute_semantic_fit(resume_json, role_json)`.
- Prints parsed resume keys, experience entries, role keys, responsibilities, and semantic match score + matches.

### `test_role_intelligence.py`

- POSTs to `http://localhost:8000/api/role-intelligence` with 5 sample job descriptions (JD1–JD5), prints status and JSON response.

### `test_explainability.py`

- Builds mock resume_json, role_json, semantic_result, prediction_result; calls `explainability_service.generate_analysis_explanation(...)`; prints strengths, weaknesses, suggestions and checks duration < 100ms.

### `test_prediction_engine.py`

- Builds mock resume, role, semantic_result; calls `PredictionService.compute_shortlisting_probability`; asserts probability in [0,1] and elapsed < 100ms.

### `test_semantic_matching.py`

- Builds sample resume_data and role_data; calls `semantic_matcher.compute_semantic_fit` twice (first load, second fast); prints fit score and top matches; verifies an expected pair and performance.

---

## 6. Run & test

- **Start server:** From `backend/`: `python main.py` or `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- **OpenAPI:** `http://localhost:8000/api/v1/openapi.json` (if `API_V1_STR` is used in OpenAPI URL; in current `main.py` the app is mounted without prefix, so docs may be at `/docs` or root depending on FastAPI version.)
- **Health:** `GET http://localhost:8000/health`
- **Full analysis:** `POST http://localhost:8000/api/full-analysis` with `file` (PDF/DOCX) and `job_description` (form).

---

*End of backend reference.*
