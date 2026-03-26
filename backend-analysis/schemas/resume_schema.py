# schemas/resume_schema.py
from pydantic import BaseModel, Field
from typing import List, Optional

class ExperienceItem(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)

class EducationItem(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None

class ProjectItem(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ParsedResume(BaseModel):
    skills: List[str] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    raw_text: Optional[str] = None

class ParseResponse(BaseModel):
    status: str
    message: Optional[str] = None
    parsed_resume: Optional[ParsedResume] = None
