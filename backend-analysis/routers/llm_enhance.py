# routers/llm_enhance.py
"""
LLM Enhancement Endpoint — used by the Resume Builder frontend to
AI-enhance individual resume fields (summary, bullets, skills, etc.).

Calls Groq/configured LLM provider. Falls back to returning the original
text if the LLM is unavailable or the key is not set.
"""
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class EnhanceRequest(BaseModel):
    system_prompt: str
    user_prompt: str


class EnhanceResponse(BaseModel):
    result: str


@router.post("/llm/enhance", response_model=EnhanceResponse)
async def enhance_text(request: EnhanceRequest):
    """
    Generic LLM enhancement endpoint.
    Accepts a system_prompt + user_prompt, returns the LLM's text response.
    Falls back gracefully when LLM is unavailable.
    """
    if not request.user_prompt or len(request.user_prompt.strip()) < 3:
        raise HTTPException(status_code=400, detail="user_prompt too short")

    if not settings.USE_LLM:
        logger.info("USE_LLM=false — returning original text without enhancement")
        return EnhanceResponse(result=request.user_prompt)

    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY.startswith("paste-"):
        logger.warning("GROQ_API_KEY not configured — returning original text")
        return EnhanceResponse(result=request.user_prompt)

    try:
        if settings.LLM_PROVIDER.lower() == "groq":
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            response = client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system", "content": request.system_prompt},
                    {"role": "user", "content": request.user_prompt},
                ],
                temperature=0.4,
                max_tokens=500,
            )
            result_text = response.choices[0].message.content.strip()
            return EnhanceResponse(result=result_text)
        else:
            logger.warning(f"LLM provider '{settings.LLM_PROVIDER}' not supported for enhance — returning original")
            return EnhanceResponse(result=request.user_prompt)

    except Exception as exc:
        logger.error(f"LLM enhance failed: {exc}")
        # Graceful fallback — return original text instead of crashing
        return EnhanceResponse(result=request.user_prompt)
