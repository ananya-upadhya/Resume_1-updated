# main.py
import os
# Limit threads to reduce memory usage on 512MB RAM machines like Render Free
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
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
from routers import llm_enhance

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
        # Only check Groq health if a real key is configured
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY.startswith("paste-"):
            logger.warning(
                "⚠ GROQ_API_KEY not set — app will run in heuristic-only fallback mode. "
                "Set GROQ_API_KEY in .env with your real key to enable LLM features."
            )
        else:
            try:
                from services.groq_health import check_groq_running
                reachable = check_groq_running()
                if reachable:
                    logger.info("✓ Groq API reachable — LLM suggestions enabled.")
                else:
                    logger.warning(
                        "⚠ Groq API unreachable — app will run in heuristic-only fallback mode. "
                        "Check your GROQ_API_KEY in .env."
                    )
            except Exception as exc:
                logger.warning(
                    f"⚠ Groq health check failed ({exc}) — app will still start "
                    "in heuristic-only fallback mode."
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
app.include_router(llm_enhance.router,          prefix="/api", tags=["LLM Enhance"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
