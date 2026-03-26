# services/llm_client.py
"""
Layer 2 — LLM Client (multi-provider, provider-switch via .env only)

Active provider : groq   (llama-3.3-70b-versatile, free tier)
Prepared but    : claude  (uncomment ANTHROPIC section when ready)
commented out   : ollama  (uncomment OLLAMA section for self-hosted)

To switch providers:
  Groq   → Claude : set LLM_PROVIDER=claude  + ANTHROPIC_API_KEY in .env
  Groq   → Ollama : set LLM_PROVIDER=ollama  + LLM_MODEL in .env
  Zero code changes in any other file.
"""
import json
import re
import logging
from typing import Dict, Any
from config.settings import settings

logger = logging.getLogger(__name__)


def _strip_fences(content: str) -> str:
    """Strip markdown code fences (```json ... ``` or ``` ... ```)."""
    clean = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", content, flags=re.DOTALL).strip()
    if clean.startswith("`"):
        clean = clean.strip("`").strip()
    return clean


def _parse_json(content: str) -> Dict[str, Any]:
    """Strip fences then parse JSON; raise ValueError with clear message on failure."""
    clean = _strip_fences(content)
    try:
        return json.loads(clean)
    except json.JSONDecodeError as exc:
        logger.error(f"JSON parse failure. Raw LLM content: {content[:500]}")
        raise ValueError(f"Invalid JSON from LLM: {exc}") from exc


# ──────────────────────────────────────────────────────────────────
# GROQ PROVIDER  (active)
# ──────────────────────────────────────────────────────────────────
def _call_groq(prompt: str, temperature: float) -> Dict[str, Any]:
    from groq import Groq  # pip install groq>=0.4.0
    client = Groq(api_key=settings.GROQ_API_KEY)
    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=1000,
        response_format={"type": "json_object"},  # forces valid JSON output
    )
    content = response.choices[0].message.content
    return _parse_json(content)


# ──────────────────────────────────────────────────────────────────
# CLAUDE PROVIDER  (prepared — uncomment when ready)
# Step 1: pip install anthropic
# Step 2: In .env set LLM_PROVIDER=claude, ANTHROPIC_API_KEY=..., LLM_MODEL=claude-sonnet-4-20250514
# Step 3: Restart server — zero other file changes
# ──────────────────────────────────────────────────────────────────
def _call_claude(prompt: str, temperature: float) -> Dict[str, Any]:
    raise NotImplementedError(
        "Claude provider not yet activated. "
        "pip install anthropic, set LLM_PROVIDER=claude and ANTHROPIC_API_KEY in .env."
    )
    # --- Uncomment below when ready ---
    # import anthropic
    # client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    # response = client.messages.create(
    #     model=settings.LLM_MODEL,
    #     max_tokens=1000,
    #     temperature=temperature,
    #     messages=[{"role": "user", "content": prompt}],
    # )
    # return _parse_json(response.content[0].text)


# ──────────────────────────────────────────────────────────────────
# OLLAMA PROVIDER  (prepared — uncomment for self-hosted)
# Step 1: Install Ollama, run: ollama pull llama3.2
# Step 2: In .env set LLM_PROVIDER=ollama, LLM_MODEL=llama3.2
# Step 3: Restart server — zero other file changes
# ──────────────────────────────────────────────────────────────────
def _call_ollama(prompt: str, temperature: float) -> Dict[str, Any]:
    raise NotImplementedError(
        "Ollama provider not yet activated. "
        "Install Ollama locally, set LLM_PROVIDER=ollama in .env."
    )
    # --- Uncomment below when ready ---
    # import ollama
    # response = ollama.chat(
    #     model=settings.LLM_MODEL,
    #     messages=[{"role": "user", "content": prompt}],
    #     options={"temperature": temperature},
    # )
    # return _parse_json(response["message"]["content"])


# ──────────────────────────────────────────────────────────────────
# PUBLIC INTERFACE
# ──────────────────────────────────────────────────────────────────
_PROVIDERS = {
    "groq": _call_groq,
    "claude": _call_claude,
    "ollama": _call_ollama,
}


def call_llm(prompt: str, temperature: float = 0.3) -> Dict[str, Any]:
    """
    Route prompt to the configured LLM provider.
    Provider is selected via settings.LLM_PROVIDER (.env only).
    Raises on failure — callers must wrap in try/except with fallback.
    """
    provider = settings.LLM_PROVIDER.lower()
    handler = _PROVIDERS.get(provider)
    if not handler:
        raise ValueError(
            f"Unknown LLM_PROVIDER='{provider}'. Valid options: groq, claude, ollama"
        )
    logger.info(f"Calling LLM provider={provider} model={settings.LLM_MODEL}")
    return handler(prompt, temperature)
