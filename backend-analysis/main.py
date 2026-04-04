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
    llm_router,
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
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://resume-1-updated.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"LLM config: provider={settings.LLM_PROVIDER}, model={settings.LLM_MODEL}, use_llm={settings.USE_LLM}")

    # Startup health check removed to prevent Render deployment timeouts.
    # Health status is now reported dynamically via the /health endpoint.


@app.get("/")
async def root():
    return {
        "message": "Resume Intelligence API is running",
        "docs": "/docs",
        "health": "/health"
    }


# ── Register all routers ──────────────────────────────────────────────────────
app.include_router(system.router,               tags=["System"])
app.include_router(analysis.router,             prefix="/api", tags=["Full Analysis"])
app.include_router(resume_parser.router,        prefix="/api", tags=["Resume Parser"])
app.include_router(role_intelligence.router,    prefix="/api", tags=["Role Intelligence"])
app.include_router(semantic_matching.router,    prefix="/api", tags=["Semantic Matching"])
app.include_router(prediction_router.router,    prefix="/api", tags=["Prediction"])
app.include_router(explainability_router.router, prefix="/api", tags=["Explainability"])
app.include_router(optimization_router.router,  prefix="/api", tags=["Optimization"])
app.include_router(llm_router.router,           prefix="/api", tags=["LLM"])

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
