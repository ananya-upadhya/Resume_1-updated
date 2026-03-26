import asyncio
import json
import logging
from services.parser_service import ParserService
from services.role_intelligence_service import RoleIntelligenceService
from services.semantic_matching_service import SemanticMatchingService

logging.basicConfig(level=logging.INFO)

def debug_pipeline():
    print("--- DEBUGGING PIPELINE ---")
    
    # 1. Parse Resume
    try:
        with open("test_resume.txt", "rb") as f:
            resume_bytes = f.read()
            # Note: test_resume.txt is treated as txt here but parser expects pdf/docx.
            # We'll just pass some mock text directly to the extraction methods to simulate.
            resume_text = resume_bytes.decode('utf-8')
            print("Extracted Resume Text:", len(resume_text), "chars")
            
            skills = ParserService.extract_skills(resume_text)
            experience = [exp.model_dump() for exp in ParserService.extract_experience(resume_text)]
            education = [edu.model_dump() for edu in ParserService.extract_education(resume_text)]
            
            resume_json = {
                "skills": skills,
                "experience": experience,
                "education": education,
                "raw_text": resume_text
            }
            print("\nParsed Resume JSON Keys:", list(resume_json.keys()))
            print("Experience entries:", len(resume_json["experience"]))
            for exp in resume_json["experience"]:
                print(f"  Role: {exp.get('role')} | Bullets: {len(exp.get('bullets', []))}")
                
    except Exception as e:
        print(f"Resume parsing error: {e}")
        return

    # 2. Parse Role
    try:
        job_description = "We are looking for a Senior Frontend Engineer to develop scalable frontend dashboards, lead a team of engineers, and optimize database queries for 30% performance gain. Required skills: React, CI/CD, SQL performance tuning."
        role_data = RoleIntelligenceService.process_job_description(job_description)
        role_json = role_data.model_dump()
        
        print("\nParsed Role JSON Keys:", list(role_json.keys()))
        print("Responsibilities:", len(role_json["responsibilities"]))
        for r in role_json["responsibilities"]:
            print(f"  - {r}")
            
    except Exception as e:
        print(f"Role parsing error: {e}")
        return
        
    # 3. Semantic Match
    try:
        matcher = SemanticMatchingService()
        result = matcher.compute_semantic_fit(resume_json, role_json)
        print("\nMatch Result:", result["semantic_fit_score"])
        for m in result["matches"]:
            print(f"  {m['similarity']:.2f}: {m['resume_sentence']} -> {m['job_requirement']}")
    except Exception as e:
        print(f"\nSEMANTIC MATCH ERROR: {e}")

if __name__ == "__main__":
    debug_pipeline()
