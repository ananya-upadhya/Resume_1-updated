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
async def _call_groq(prompt: str, temperature: float) -> Dict[str, Any]:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in environment variables.")
    from groq import AsyncGroq # pip install groq>=0.4.0
    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=1000,
        response_format={"type": "json_object"},  # forces valid JSON output
    )
    content = response.choices[0].message.content
    return _parse_json(content)


async def _call_groq_text(system_prompt: str, user_prompt: str, temperature: float) -> str:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in environment variables.")
    from groq import AsyncGroq
    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_prompt})

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=1000,
    )
    return response.choices[0].message.content or ""


# ──────────────────────────────────────────────────────────────────
# CLAUDE PROVIDER  (prepared — uncomment when ready)
# ──────────────────────────────────────────────────────────────────
async def _call_claude(prompt: str, temperature: float) -> Dict[str, Any]:
    raise NotImplementedError("Claude provider not yet activated.")


async def _call_claude_text(system_prompt: str, user_prompt: str, temperature: float) -> str:
    raise NotImplementedError("Claude provider not yet activated.")


# ──────────────────────────────────────────────────────────────────
# OLLAMA PROVIDER  (prepared — uncomment for self-hosted)
# ──────────────────────────────────────────────────────────────────
async def _call_ollama(prompt: str, temperature: float) -> Dict[str, Any]:
    raise NotImplementedError("Ollama provider not yet activated.")


async def _call_ollama_text(system_prompt: str, user_prompt: str, temperature: float) -> str:
    raise NotImplementedError("Ollama provider not yet activated.")


# ──────────────────────────────────────────────────────────────────
# PUBLIC INTERFACE
# ──────────────────────────────────────────────────────────────────
_PROVIDERS = {
    "groq": _call_groq,
    "claude": _call_claude,
    "ollama": _call_ollama,
}

_PROVIDERS_TEXT = {
    "groq": _call_groq_text,
    "claude": _call_claude_text,
    "ollama": _call_ollama_text,
}


async def call_llm(prompt: str, temperature: float = 0.3) -> Dict[str, Any]:
    """
    Route prompt to the configured LLM provider (JSON response).
    """
    provider = settings.LLM_PROVIDER.lower()
    handler = _PROVIDERS.get(provider)
    if not handler:
        raise ValueError(f"Unknown LLM_PROVIDER='{provider}'")
    logger.info(f"Calling LLM provider={provider} (JSON)")
    return await handler(prompt, temperature)


async def call_llm_text(system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
    """
    Route prompt to the configured LLM provider (Plain text response).
    """
    provider = settings.LLM_PROVIDER.lower()
    handler = _PROVIDERS_TEXT.get(provider)
    if not handler:
        raise ValueError(f"Unknown LLM_PROVIDER='{provider}'")
    logger.info(f"Calling LLM provider={provider} (TEXT)")
    return await handler(system_prompt, user_prompt, temperature)
