import time
from services.explainability_service import explainability_service

def run_test():
    print("Testing Explainability Engine (Service Layer)...\n")
    
    resume_json = {
        "skills": ["React", "JavaScript", "AWS"],
        "experience": [{"role": "Frontend Dev", "bullets": ["Built UI"]}],
        "education": [{"degree": "B.S."}]
    }
    role_json = {
        "required_skills": ["React", "Redux", "Typescript", "AWS"],
        "experience_level": "3 years",
        "responsibilities": ["Develop scalable UI"]
    }
    semantic_result = {
        "semantic_fit_score": 0.85
    }
    prediction_result = {
        "shortlisting_probability": 0.65,
        "score_breakdown": {
            "semantic_fit": 0.85,
            "skill_match": 0.5,
            "experience_relevance": 0.9,
            "achievement_strength": 0.2, # low, should trigger weakness
            "ats_compliance": 1.0
        }
    }
    
    start_time = time.time()
    result = explainability_service.generate_analysis_explanation(
        resume_json, role_json, semantic_result, prediction_result
    )
    end_time = time.time()
    
    duration_ms = (end_time - start_time) * 1000
    print(f"Duration: {duration_ms:.2f} ms")
    
    print("\n--- Strengths ---")
    for s in result["strengths"]:
        print(f"✅ {s}")
        
    print("\n--- Weaknesses ---")
    for w in result["weaknesses"]:
        print(f"⚠️ {w}")
        
    print("\n--- Suggestions ---")
    for s in result["suggestions"]:
        print(f"💡 {s}")
        
    if duration_ms < 100:
        print("\nPerformance requirement met: < 100ms")
    else:
        print(f"\nPerformance requirement FAILED. Took {duration_ms:.2f}ms")

if __name__ == "__main__":
    run_test()
