# schemas/role_schema.py
from pydantic import BaseModel
from typing import List, Optional

class RoleInput(BaseModel):
    job_description: str

class RoleData(BaseModel):
    role: str
    required_skills: List[str]
    tools: List[str]
    experience_level: str
    responsibilities: List[str]

class RoleResponse(BaseModel):
    status: str
    role_data: Optional[RoleData] = None
