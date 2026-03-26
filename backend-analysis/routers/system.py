# routers/system.py
from fastapi import APIRouter
from config.settings import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": settings.VERSION,
        "llm_provider": settings.LLM_PROVIDER,
        "llm_model": settings.LLM_MODEL,
        "use_llm": settings.USE_LLM,
    }


@router.get("/api/version")
async def api_version():
    return {"version": settings.VERSION, "project": settings.PROJECT_NAME}
