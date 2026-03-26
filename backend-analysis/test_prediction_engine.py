import json
import time
from services.prediction_service import PredictionService

def run_test():
    resume_json = {
        "skills": ["Python", "React", "AWS", "SQL", "Docker", "JavaScript"],
        "experience": [
            {
                "role": "Senior Engineer",
                "company": "Tech Corp",
                "bullets": [
                    "Improved backend performance by 20%",
                    "Deployed on AWS using Docker"
                ]
            },
            {
                "role": "Software Developer",
                "company": "Web LLC",
                "bullets": [
                    "Built SPAs with React and JavaScript",
                    "Redesigned the main landing page"
                ]
            }
        ],
        "education": [
            {
                "degree": "B.S. Computer Science"
            }
        ]
    }

    role_json = {
        "required_skills": ["Python", "AWS", "Docker", "Kubernetes", "Redis"],
        "experience_level": "3+ years"
    }

    semantic_result = {
        "semantic_fit_score": 0.85
    }

    print("Running prediction engine...")
    start = time.time()
    res = PredictionService.compute_shortlisting_probability(resume_json, role_json, semantic_result)
    end = time.time()
    
    elapsed = (end - start) * 1000
    
    print(json.dumps(res, indent=2))
    print(f"Elapsed time: {elapsed:.2f} ms")
    
    assert 0.0 <= res["shortlisting_probability"] <= 1.0
    assert elapsed < 100.0, "Execution took more than 100ms"
    print("Test passed.")

if __name__ == "__main__":
    run_test()
