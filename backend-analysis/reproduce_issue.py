
import sys
import os
import asyncio

# Add the current directory to sys.path to import local modules
sys.path.append(os.getcwd())

# Mock settings for testing
from config.settings import settings
settings.USE_LLM = False # Disable LLM for local extraction test to keep it fast

from services.parser_service import ParserService
from services.role_intelligence_service import RoleIntelligenceService

async def main():
    resume_text = """
    SKILLS
    JavaScript · HTML5 · CSS · React · TypeScript · Redux · Webpack · Bootstrap
    """

    job_description = "Frontend Developer"

    print("--- Testing ParserService ---")
    parsed_skills = ParserService.extract_skills(resume_text)
    print(f"Extracted Resume Skills: {parsed_skills}")

    print("\n--- Testing RoleIntelligenceService ---")
    role_data = await RoleIntelligenceService.process_job_description(job_description)
    print(f"Extracted Role: {role_data.role}")
    print(f"Required Skills: {role_data.required_skills}")

    # Simulate the logic in analysis.py
    resume_skills_lower = {s.lower() for s in parsed_skills}
    missing_skills = [
        skill for skill in role_data.required_skills 
        if skill.lower() not in resume_skills_lower
    ]

    print(f"\nMissing Skills: {missing_skills}")
    
    # Check if modern skills are found
    expected = ["JavaScript", "HTML5", "CSS", "React", "TypeScript", "Redux", "Webpack", "Bootstrap"]
    found_all = all(s in parsed_skills for s in expected)
    print(f"\nFound all expected skills from resume? {'YES' if found_all else 'NO'}")
    if not found_all:
        missing = [s for s in expected if s not in parsed_skills]
        print(f"Actually missing from extraction: {missing}")

if __name__ == "__main__":
    asyncio.run(main())
