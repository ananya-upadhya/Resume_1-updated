import requests
import json

URL = "http://localhost:8000/api/role-intelligence"

JD1 = """
Backend Python Developer
We are looking for a backend developer with 3+ years of experience.
You will build scalable web applications.
You will develop APIs using Python and FastAPI.
Must have experience with AWS and Docker.
Familiarity with PostgreSQL is required.
"""

JD2 = """
Senior Frontend Engineer - React
Seeking a frontend guru with 5 years experience.
Design and implement responsive user interfaces.
Ensure the performance of the UI and optimize components.
Skills required: React, JavaScript, TypeScript, Redux.
Tools: Git, Webpack.
"""

JD3 = """
DevOps Engineer
Responsible for maintaining our cloud infrastructure.
2-4 years of experience requested.
Manage CI/CD pipelines and monitor system health.
Implement infrastructure as code.
Required: Kubernetes, Docker, AWS, Jenkins, Jira.
"""

JD4 = """
Full Stack Node.js Developer
Minimum 4+ years of experience in software development.
Create robust APIs and integrate frontend applications.
Collaborate with cross-functional teams.
Tech stack: Node.js, Express, React, MongoDB.
Tools: Slack, Figma, GitHub.
"""

JD5 = """
Data Scientist
Looking for an experienced Data Scientist. 2 years experience.
Analyze large datasets to extract actionable insights.
Train and deploy machine learning models.
Collaborate with data engineers.
Skills: Python, SQL, Machine Learning.
"""

samples = [JD1, JD2, JD3, JD4, JD5]

for i, jd in enumerate(samples, 1):
    print(f"--- Testing Job Description {i} ---")
    response = requests.post(URL, json={"job_description": jd})
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print("\n")
