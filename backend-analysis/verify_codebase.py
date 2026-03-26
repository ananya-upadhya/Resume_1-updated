"""Quick syntax + structure verification of all rewritten backend files."""
import ast, os, sys

BASE = r"c:\Users\DELL\OneDrive\Desktop\analysis\resume-intelligence\backend"
os.chdir(BASE)

files = [
    "config/settings.py",
    "services/llm_client.py",
    "services/groq_health.py",
    "services/parser_service.py",
    "services/role_intelligence_service.py",
    "services/semantic_matching_service.py",
    "services/prediction_service.py",
    "services/explainability_service.py",
    "services/optimization_service.py",
    "schemas/resume_schema.py",
    "schemas/role_schema.py",
    "schemas/semantic_schema.py",
    "schemas/prediction_schema.py",
    "schemas/explainability_schema.py",
    "schemas/analysis.py",
    "routers/__init__.py",
    "routers/system.py",
    "routers/analysis.py",
    "routers/resume_parser.py",
    "routers/role_intelligence.py",
    "routers/semantic_matching.py",
    "routers/prediction_router.py",
    "routers/explainability_router.py",
    "routers/optimization_router.py",
    "main.py",
    "render.yaml",
    "requirements.txt",
    ".env.example",
]

# --- 1. File existence + syntax check ---
ok, errors = [], []
for f in files:
    if not os.path.exists(f):
        errors.append(f"MISSING: {f}")
        continue
    if f.endswith(".py"):
        try:
            with open(f, encoding="utf-8") as fh:
                ast.parse(fh.read())
            ok.append(f)
        except SyntaxError as e:
            errors.append(f"SYNTAX ERROR in {f}: line {e.lineno}: {e.msg}")
    else:
        ok.append(f"[non-py ok] {f}")

print(f"\n=== FILE CHECK: {len(ok)} OK, {len(errors)} errors ===")
for e in errors:
    print(f"  ✗ {e}")
if not errors:
    print("  ✓ All files present and syntax-valid.")

# --- 2. Check heuristic services contain NO call_llm imports ---
heuristic_services = [
    "services/role_intelligence_service.py",
    "services/semantic_matching_service.py",
    "services/prediction_service.py",
    "services/parser_service.py",
]
print("\n=== HEURISTIC LAYER LLM-FREE CHECK ===")
for f in heuristic_services:
    with open(f, encoding="utf-8") as fh:
        content = fh.read()
    if "call_llm" in content or "from services.llm_client" in content:
        print(f"  ✗ VIOLATION: {f} contains LLM call!")
    else:
        print(f"  ✓ {f} — no LLM calls (correct)")

# --- 3. Check Groq services contain call_llm ---
groq_services = [
    "services/explainability_service.py",
    "services/optimization_service.py",
]
print("\n=== GROQ LAYER CHECK ===")
for f in groq_services:
    with open(f, encoding="utf-8") as fh:
        content = fh.read()
    if "call_llm" in content:
        print(f"  ✓ {f} — uses call_llm (correct)")
    else:
        print(f"  ✗ {f} — missing call_llm!")

# --- 4. Check analysis.py has all Module 2 fields ---
print("\n=== MODULE 2 SCHEMA CHECK ===")
schema_path = "schemas/analysis.py"
with open(schema_path, encoding="utf-8") as fh:
    schema_content = fh.read()

required_fields = [
    "shortlisting_probability",
    "keyword_match_score",
    "skill_alignment_score",
    "achievement_strength_score",
    "experience_relevance_score",
    "ats_compliance_score",
    "weak_sections",
    "semantic_matches",
    "missing_skills",
    "study_roadmap",
    "suggestions",
]
for field in required_fields:
    if field in schema_content:
        print(f"  ✓ {field}")
    else:
        print(f"  ✗ MISSING: {field}")

# --- 5. Check main.py no longer uses ollama ---
print("\n=== MAIN.PY LEGACY CHECK ===")
with open("main.py", encoding="utf-8") as fh:
    main_content = fh.read()
if "ollama" in main_content:
    print("  ✗ main.py still references 'ollama'!")
else:
    print("  ✓ main.py — no ollama references")
if "groq_health" in main_content:
    print("  ✓ main.py — imports groq_health (correct)")
else:
    print("  ✗ main.py — missing groq_health import!")

print("\n=== DONE ===")
