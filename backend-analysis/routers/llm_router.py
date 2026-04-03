# routers/llm_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_client import call_llm_text
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class EnhanceRequest(BaseModel):
    system_prompt: str
    user_prompt: str
    temperature: float = 0.7

@router.post("/llm/enhance")
async def enhance_content(request: EnhanceRequest):
    try:
        result = await call_llm_text(
            system_prompt=request.system_prompt,
            user_prompt=request.user_prompt,
            temperature=request.temperature
        )
        return {"result": result}
    except Exception as e:
        logger.error(f"Error in enhance_content: {e}")
        raise HTTPException(status_code=500, detail=str(e))
