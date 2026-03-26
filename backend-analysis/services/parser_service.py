# services/parser_service.py
import re
import io
import spacy
import pdfplumber
import docx
from typing import Optional, List, Dict, Any
from schemas.resume_schema import ParsedResume, ExperienceItem, EducationItem, ProjectItem

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import en_core_web_sm
    nlp = en_core_web_sm.load()

SKILL_DICTIONARY = {
    "react", "javascript", "python", "node", "aws", "docker", "sql",
    "typescript", "java", "c++", "c#", "ruby", "go", "rust",
    "html", "css", "mongodb", "postgresql", "mysql", "redis",
    "kubernetes", "azure", "gcp", "git", "linux", "machine learning",
    "data analysis", "agile", "scrum", "vue", "angular", "nextjs", "django",
    "fastapi", "flask", "express", "spring boot", "react native"
}

class ParserService:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        text = ""
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {e}")
        return text

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        text = ""
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            raise Exception(f"Failed to extract text from DOCX: {e}")
        return text

    @staticmethod
    def clean_text(text: str) -> str:
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()

    @staticmethod
    def extract_skills(text: str) -> List[str]:
        doc = nlp(text.lower())
        skills_found = set()
        for token in doc:
            if token.text in SKILL_DICTIONARY:
                skills_found.add(token.text)
        text_lower = text.lower()
        for skill in SKILL_DICTIONARY:
            if " " in skill and skill in text_lower:
                skills_found.add(skill)
        return sorted([s.title() if s != "aws" and s != "sql" else s.upper() for s in skills_found])

    @staticmethod
    def extract_experience(text: str) -> List[ExperienceItem]:
        experiences = []
        lines = text.split('\n')
        in_experience_section = False
        current_role = None
        current_company = None
        current_bullets = []
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if re.match(r'^(work experience|experience|professional experience|employment history|employment|internships)\s*$', line_lower):
                in_experience_section = True
                continue
            elif in_experience_section and re.match(r'^(education|skills|technical skills|core competencies|projects|academic projects|personal projects|summary|academic background)\s*$', line_lower):
                in_experience_section = False
                if current_role or current_company:
                    experiences.append(ExperienceItem(role=current_role, company=current_company, bullets=current_bullets))
                break
            if in_experience_section:
                clean_line = line.strip()
                if not clean_line: continue
                bullet_match = re.match(r'^([-\•\*\❖\➤]|##|\d+\.)\s*', clean_line)
                if bullet_match:
                    bullet_text = clean_line[bullet_match.end():].strip()
                    if current_role or current_company: current_bullets.append(bullet_text)
                else:
                    if len(clean_line) < 100:
                        if not current_role:
                            if current_role or current_company:
                                experiences.append(ExperienceItem(role=current_role, company=current_company, bullets=current_bullets))
                                current_bullets = []
                            title_match = re.search(r'(.+?)\s+[-|—]\s+(.+)', clean_line)
                            if title_match:
                                current_company = title_match.group(1).strip()
                                current_role = title_match.group(2).strip()
                            else:
                                current_role = clean_line
                                doc_line = nlp(clean_line)
                                for ent in doc_line.ents:
                                    if ent.label_ == "ORG" and not current_company:
                                        current_company = ent.text
                        elif not current_company:
                             current_company = clean_line
        if (current_role or current_company) and current_bullets:
            experiences.append(ExperienceItem(role=current_role, company=current_company, bullets=current_bullets))
        return experiences

    @staticmethod
    def extract_projects(text: str) -> List[ProjectItem]:
        projects = []
        lines = text.split('\n')
        in_projects_section = False
        current_name = None
        current_desc = []
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if re.match(r'^(projects|personal projects|academic projects)\s*$', line_lower):
                in_projects_section = True
                continue
            elif in_projects_section and re.match(r'^(experience|education|skills|summary|academic background)\s*$', line_lower):
                in_projects_section = False
                if current_name:
                    projects.append(ProjectItem(name=current_name, description=" ".join(current_desc)))
                break
            if in_projects_section:
                clean_line = line.strip()
                if not clean_line: continue
                bullet_match = re.match(r'^([-\•\*\❖\➤]|##|\d+\.)\s*', clean_line)
                if bullet_match:
                    bullet_text = clean_line[bullet_match.end():].strip()
                    if current_name: current_desc.append(bullet_text)
                else:
                    if len(clean_line) < 80:
                        if not current_name: current_name = clean_line
                        else:
                            if current_desc:
                                projects.append(ProjectItem(name=current_name, description=" ".join(current_desc)))
                                current_desc = []
                            current_name = clean_line
                    else:
                        if current_name: current_desc.append(clean_line)
        if current_name:
            projects.append(ProjectItem(name=current_name, description=" ".join(current_desc)))
        return projects

    @staticmethod
    def extract_education(text: str) -> List[EducationItem]:
        education = []
        lines = text.split('\n')
        in_edu_section = False
        current_degree = None
        current_inst = None
        current_year = None
        for line in lines:
            line_lower = line.lower().strip()
            if re.match(r'^(education|academic background)\s*$', line_lower):
                in_edu_section = True
                continue
            elif in_edu_section and re.match(r'^(experience|skills|projects|summary)\s*$', line_lower):
                in_edu_section = False
                break
            if in_edu_section:
                clean_line = line.strip()
                if not clean_line: continue
                if not current_degree and any(w in line_lower for w in ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'degree', 'cgpa', 'gpa']):
                     current_degree = clean_line
                if not current_year:
                    year_match = re.search(r'\b(19|20)\d{2}\b', clean_line)
                    if year_match: current_year = year_match.group(0)
                if not current_inst:
                     if any(w in line_lower for w in ['university', 'college', 'institute', 'school']):
                          current_inst = clean_line
        if current_degree or current_inst:
            education.append(EducationItem(degree=current_degree, institution=current_inst, year=current_year))
        return education

    @classmethod
    def parse_resume(cls, file_bytes: bytes, filename: str) -> ParsedResume:
        if filename.lower().endswith('.pdf'): raw_text = cls.extract_text_from_pdf(file_bytes)
        elif filename.lower().endswith('.docx'): raw_text = cls.extract_text_from_docx(file_bytes)
        else: raise ValueError(f"Unsupported file format: {filename}")
        cleaned_text = cls.clean_text(raw_text)
        skills = cls.extract_skills(cleaned_text)
        experience = cls.extract_experience(cleaned_text)
        education = cls.extract_education(cleaned_text)
        projects = cls.extract_projects(cleaned_text)
        if not experience or all(not e.bullets for e in experience):
            doc = nlp(cleaned_text)
            fallback_bullets = []
            for sent in doc.sents:
                clean_sent = sent.text.strip()
                if len(clean_sent.split()) >= 4 and any(token.pos_ == "VERB" for token in sent):
                    fallback_bullets.append(clean_sent)
            if fallback_bullets:
                experience.append(ExperienceItem(role="Extracted Experience", company="Resume Scan", bullets=fallback_bullets))
        return ParsedResume(skills=skills, experience=experience, education=education, projects=projects, raw_text=cleaned_text)
