
import spacy
import os

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import en_core_web_sm
    nlp = en_core_web_sm.load()

resume_text = """
SKILLS
JavaScript · HTML5 · CSS · React · TypeScript · Redux · Webpack · Bootstrap
"""

doc = nlp(resume_text.lower())
tokens = [token.text for token in doc]
print(f"Tokens: {tokens}")

SKILL_DICTIONARY = {
    # Tech
    "react", "javascript", "python", "node", "aws", "docker", "sql", "typescript", 
    "java", "c++", "c#", "ruby", "go", "rust", "html", "css", "mongodb", "postgresql", 
    "mysql", "redis", "kubernetes", "azure", "gcp", "git", "linux", "machine learning",
    "data analysis", "agile", "scrum", "vue", "angular", "nextjs", "django",
    "fastapi", "flask", "express", "spring boot", "react native", "flutter",
    "pandas", "numpy", "tableau", "power bi", "hadoop", "spark", "kafka",
}

skills_found = set()
for token in doc:
    if token.text in SKILL_DICTIONARY:
        skills_found.add(token.text)

print(f"Skills Found: {skills_found}")
