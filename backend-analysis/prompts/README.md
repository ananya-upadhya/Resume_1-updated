# Production Prompt System

This folder holds the **Production Prompt System** templates used by the Resume Intelligence backend when `USE_LLM=true` and `ANTHROPIC_API_KEY` is set.

## Prompts

| Prompt | Template | Used In |
|--------|----------|---------|
| 1 — Role Intelligence | `PROMPT_1_ROLE_INTELLIGENCE` | `services/role_intelligence_service.py` |
| 2 — Semantic Scoring | `PROMPT_2_SEMANTIC_SCORING` | (Optional enhancement in `semantic_matching_service`) |
| 3 — Explainability | `PROMPT_3_EXPLAINABILITY` | `services/explainability_service.py` |
| 4 — Optimization | `PROMPT_4_OPTIMIZATION` | `services/optimization_service.py` |
| 5 — Full Pipeline | `PROMPT_5_FULL_PIPELINE` | `routers/analysis.py` → `POST /api/full-analysis-llm` |

## Env

- **ANTHROPIC_API_KEY** — Your Anthropic API key (required for LLM).
- **USE_LLM** — Set to `true` to use Claude for role extraction, explainability, and optimization; otherwise heuristic logic is used.

## Model & params

- Model: `claude-sonnet-4-20250514`
- Prompts 1–4: `max_tokens=1500`; Prompt 5: `max_tokens=2500`
- Scoring (2, 5): `temperature=0.1`; suggestions (3, 4): `temperature=0.3`

## Variables

- `{{JOB_DESCRIPTION}}` — Raw job description string
- `{{RESUME_JSON}}` — Parsed resume `model_dump()` as JSON string
- `{{ROLE_JSON}}` — Role data `model_dump()` as JSON string
- `{{RESUME_TEXT}}` — Raw resume text (Prompt 5)
- `{{ANALYSIS_JSON}}` — Combined analysis (resume, role, semantic, prediction) as JSON string
