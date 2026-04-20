# services/groq_health.py
"""
Groq health check — called at startup to verify Groq API reachability.
Returns True if Groq is reachable, False on any exception.
If unreachable: logs WARNING and app continues in heuristic-only fallback mode.
"""
import logging
from config.settings import settings

logger = logging.getLogger(__name__)


def check_groq_running() -> bool:
    """
    Ping Groq API with a minimal test call.
    Returns True if reachable, False on any exception.
    Never raises — always returns bool.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY.startswith("paste-"):
        logger.warning(
            "GROQ_API_KEY is not set. Groq suggestions will fall back to heuristic mode."
        )
        return False
    try:
        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)
        # Minimal token call — just enough to verify connectivity
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=5,
        )
        if response and response.choices:
            logger.info(
                f"Groq API reachable — model={settings.LLM_MODEL}, "
                f"provider={settings.LLM_PROVIDER}"
            )
            return True
        return False
    except Exception as exc:
        logger.warning(
            f"Groq API unreachable: {exc}. "
            "App will run in heuristic-only mode with rule-based suggestions."
        )
        return False
