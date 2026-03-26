import asyncio
import json
import time
from services.semantic_matching_service import semantic_matcher
from schemas.semantic_schema import SemanticMatchRequest

def run_test():
    print("Testing Semantic Matching Engine...\n")
    
    # Example input
    resume_data = {
        "experience": [
            {
                "responsibilities": [
                    "Built scalable React analytics dashboard",
                    "Optimized database queries for 30% performance gain",
                    "Managed team of 4 frontend developers"
                ]
            }
        ],
        "projects": [
            {
                "description": "Implemented CI/CD pipelines using GitHub Actions"
            }
        ]
    }
    
    role_data = {
        "responsibilities": [
            "Develop scalable frontend dashboards",
            "Lead a team of engineers",
            "Design RESTful APIs"
        ],
        "required_skills": [
            "React",
            "CI/CD",
            "SQL performance tuning"
        ]
    }
    
    request = SemanticMatchRequest(resume_json=resume_data, role_json=role_data)
    
    try:
        # Initial call - model will load here
        print("First call (includes model loading time)...")
        start_time = time.time()
        result = semantic_matcher.compute_semantic_fit(request.resume_json, request.role_json)
        load_time = time.time() - start_time
        print(f"First call completed in {load_time:.2f} seconds\n")
        
        # Second call - model already loaded
        print("Second call (testing performance)...")
        start_time = time.time()
        result_fast = semantic_matcher.compute_semantic_fit(request.resume_json, request.role_json)
        fast_time = time.time() - start_time
        print(f"Second call completed in {fast_time:.2f} seconds")
        
        print("\n=== SEMANTIC MATCH RESULTS ===")
        print(f"Overall Fit Score: {result['semantic_fit_score']:.2f}\n")
        
        print("Top Matches:")
        for idx, match in enumerate(result["matches"]):
            print(f"[{idx+1}] Score: {match['similarity']:.2f}")
            print(f"    Resume: {match['resume_sentence']}")
            print(f"    Role:   {match['job_requirement']}")
            print("-" * 50)
            
        # Verify specific expectations
        print("\nVerifying Example Match from Requirements:")
        target_resume = "Built scalable React analytics dashboard"
        target_role = "Develop scalable frontend dashboards"
        found = False
        for match in result["matches"]:
            if match["resume_sentence"] == target_resume and match["job_requirement"] == target_role:
                print(f"FOUND expected match! Similarity: {match['similarity']:.2f}")
                found = True
                
        if not found:
            print("WARNING: Expected match not found in top matches.")
            
        print(f"\nEngine performance check: {'PASS' if fast_time < 2.0 else 'FAIL'} (Expected < 2s, got {fast_time:.2f}s)")
            
    except Exception as e:
        print(f"Test failed with error: {e}")

if __name__ == "__main__":
    run_test()
