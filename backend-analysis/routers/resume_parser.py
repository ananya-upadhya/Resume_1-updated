# routers/resume_parser.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from schemas.resume_schema import ParseResponse
from services.parser_service import ParserService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/parse-resume", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file format.")
    try:
        contents = await file.read()
        parsed = ParserService.parse_resume(contents, file.filename)
        return ParseResponse(status="success", parsed_resume=parsed)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail="Internal server error parsing resume")
