import re
import logging
import spacy
from typing import List
from schemas.role_schema import RoleData
from config.settings import settings

logger = logging.getLogger(__name__)

# Global variable for lazy loading
_nlp_instance = None

def get_nlp():
    """Lazy-load spaCy model on demand."""
    global _nlp_instance
    if _nlp_instance is None:
        try:
            _nlp_instance = spacy.load("en_core_web_sm")
        except OSError:
            import en_core_web_sm
            _nlp_instance = en_core_web_sm.load()
    return _nlp_instance

# Predefined dictionaries according to specification
SKILLS_DICTIONARY = {
    "react", "javascript", "redux", "node", "python", "aws", 
    "docker", "kubernetes", "sql", "typescript", "java", "c++", 
    "c#", "go", "ruby", "php", "html", "css", "mongodb", "postgresql",
    "mysql", "redis", "azure", "gcp", "machine learning", "data science",
    "spring boot", "django", "fastapi", "flask", "nextjs", "next.js", "vue", "angular",
    "graphql", "rest api", "ci/cd", "agile", "scrum", "terraform", "ansible",
    "keras", "tensorflow", "pytorch", "tailwind", "express", "scala", "kotlin"
}

TOOLS_DICTIONARY = {
    "git", "docker", "jira", "postman", "kubernetes", "jenkins", 
    "github", "gitlab", "bitbucket", "confluence", "trello",
    "figma", "sketch", "slack", "webpack", "npm", "yarn"
}

ACTION_VERBS = {
    "build", "develop", "design", "manage", "optimize", "maintain",
    "create", "implement", "collaborate", "ensure", "lead", "drive",
    "architect", "test", "deploy", "monitor", "support"
}

class RoleIntelligenceService:
    @staticmethod
    def clean_text(text: str) -> str:
        # Normalize whitespace
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        # Remove markdown-style list formatting to make sentence parsing cleaner
        text = re.sub(r'^\s*[-*•]\s+', '', text, flags=re.MULTILINE)
        return text.strip()

    @staticmethod
    def extract_role(text: str) -> str:
        # Simple heuristic: often the first non-empty line contains the role
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            first_line = lines[0]
            # If it's short, it's likely the title
            if len(first_line) < 50:
                return first_line
                
        # Fallback
        return "Software Engineer"
        
    @staticmethod
    def extract_skills(text: str) -> List[str]:
        text_lower = text.lower()
        skills_found = set()
        
        # Word boundaries for exact matching
        for skill in SKILLS_DICTIONARY:
            # Handle multi-word and single-word skills distinctly with regex for whole words
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                skills_found.add(skill)
                
        # Format mapping nicely
        return sorted([s.title() if s not in ["aws", "sql"] else s.upper() for s in skills_found])

    @staticmethod
    def extract_tools(text: str) -> List[str]:
        text_lower = text.lower()
        tools_found = set()
        
        for tool in TOOLS_DICTIONARY:
            pattern = r'\b' + re.escape(tool) + r'\b'
            if re.search(pattern, text_lower):
                tools_found.add(tool)
                
        return sorted([t.title() for t in tools_found])

    @staticmethod
    def extract_experience(text: str) -> str:
        # Looking for patterns like "3+ years", "5 years", "2-4 years", "minimum 5 years", "at least 2 years"
        pattern = r'(?:minimum\s*|at\s*least\s*)?(\d+[-+]*\s*years?)'
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            # Return the first match, assuming it's the primary experience requirement
            return matches[0].lower()
        return "Not specified"

    @staticmethod
    def extract_responsibilities(text: str) -> List[str]:
        nlp = get_nlp()
        doc = nlp(text)
        responsibilities = []
        
        # Iterate over sentences
        for sent in doc.sents:
            sent_text = sent.text.strip()
            
            # Very short sentences are unlikely to be detailed responsibilities
            if len(sent_text) < 15:
                continue
                
            # Check if it starts with an action verb (lemmatized or unlemmatized)
            first_token = sent[0]
            if first_token.lower_ in ACTION_VERBS or first_token.lemma_ in ACTION_VERBS:
                responsibilities.append(sent_text)
                continue
                
            # Sometimes sentences in job descriptions start with "You will xyz"
            if len(sent) > 2 and sent[0].lower_ == "you" and sent[1].lower_ == "will":
                 if sent[2].lower_ in ACTION_VERBS or sent[2].lemma_ in ACTION_VERBS:
                     responsibilities.append(sent_text)
                     continue
                     
            # Check if any action verb is prominently used in the first few words 
            # (e.g. in bulleted lists missing proper punctuation)
            words = [t.lower_ for t in sent[:3]]
            if any(w in ACTION_VERBS for w in words):
                 responsibilities.append(sent_text)

        # Remove duplicates while preserving order
        seen = set()
        unique_resp = []
        for r in responsibilities:
             if r not in seen:
                  seen.add(r)
                  unique_resp.append(r)
                  
        # If heuristic extraction fails, fallback to simple spaCy segmentation
        if not unique_resp:
            fallback_resp = []
            for sent in doc.sents:
                clean_sent = sent.text.strip()
                if len(clean_sent.split()) >= 3:
                     fallback_resp.append(clean_sent)
            return fallback_resp
                  
        return unique_resp

    @classmethod
    def process_job_description(cls, text: str) -> RoleData:
        logger.info("Extracting role intelligence parameters from job description")
        cleaned_text = cls.clean_text(text)

        role_data = RoleData(
            role=cls.extract_role(cleaned_text),
            required_skills=cls.extract_skills(cleaned_text),
            tools=cls.extract_tools(cleaned_text),
            experience_level=cls.extract_experience(cleaned_text),
            responsibilities=cls.extract_responsibilities(cleaned_text)
        )
        logger.info(f"Role Intelligence - Skills Extracted: {len(role_data.required_skills)}")
        logger.info(f"Role Intelligence - Responsibility Sentences: {len(role_data.responsibilities)}")
        return role_data
