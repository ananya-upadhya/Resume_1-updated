# main.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from services.groq_health import check_groq_running
from routers import (
    system,
    analysis,
    resume_parser,
    role_intelligence,
    semantic_matching,
    prediction_router,
    explainability_router,
    optimization_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description=(
        "Resume Intelligence API — 3-layer architecture:\n"
        "Layer 1: Pure heuristics (spaCy, MiniLM, regex)\n"
        "Layer 2: Groq API (suggestions + roadmap only)\n"
        "Layer 3: Future provider upgrade via .env only"
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"LLM config: provider={settings.LLM_PROVIDER}, model={settings.LLM_MODEL}, use_llm={settings.USE_LLM}")

    if settings.USE_LLM and settings.LLM_PROVIDER == "groq":
        reachable = check_groq_running()
        if reachable:
            logger.info("✓ Groq API reachable — LLM suggestions enabled.")
        else:
            logger.warning(
                "⚠ Groq API unreachable — app will run in heuristic-only fallback mode. "
                "Set GROQ_API_KEY in .env to enable personalized suggestions."
            )
    elif settings.USE_LLM and settings.LLM_PROVIDER != "groq":
        logger.info(f"LLM provider '{settings.LLM_PROVIDER}' configured (not Groq — skipping health check).")
    else:
        logger.info("USE_LLM=false — running in full heuristic mode.")


# ── Register all routers ──────────────────────────────────────────────────────
app.include_router(system.router,               tags=["System"])
app.include_router(analysis.router,             prefix="/api", tags=["Full Analysis"])
app.include_router(resume_parser.router,        prefix="/api", tags=["Resume Parser"])
app.include_router(role_intelligence.router,    prefix="/api", tags=["Role Intelligence"])
app.include_router(semantic_matching.router,    prefix="/api", tags=["Semantic Matching"])
app.include_router(prediction_router.router,    prefix="/api", tags=["Prediction"])
app.include_router(explainability_router.router, prefix="/api", tags=["Explainability"])
app.include_router(optimization_router.router,  prefix="/api", tags=["Optimization"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
