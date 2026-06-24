import json
import re
from config import FEEDBACK_MODEL
from groq_client import call_groq_model
from services.evaluation_service import parse_json_payload, extract_text

ROLE_KEYWORDS = {
    "MERN Developer": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST", "APIs", "HTML", "CSS", "Redux"],
    "Frontend Developer": ["React", "Vue", "Angular", "JavaScript", "TypeScript", "CSS", "HTML", "Responsive", "Accessibility", "UI/UX"],
    "Backend Developer": ["Node.js", "Express", "Java", "Python", "SQL", "APIs", "Microservices", "Docker", "Kubernetes", "Authentication"],
    "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "REST", "JavaScript", "CSS", "HTML", "CI/CD", "Cloud"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Data", "ML", "Model", "NLP", "Scikit-learn", "Statistics", "Algorithms"],
    "Data Analyst": ["SQL", "Python", "Pandas", "Tableau", "Power BI", "Visualization", "Excel", "Data Cleaning", "Analytics", "Reporting"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Terraform", "Monitoring", "Automation", "Linux", "SRE"],
}


def run_local_analysis(resume_text: str, role: str) -> dict:
    normalized = (resume_text or "").lower()
    role_keywords = ROLE_KEYWORDS.get(role, ROLE_KEYWORDS["Frontend Developer"])
    
    matched = [kw for kw in role_keywords if kw.lower() in normalized]
    missing = [kw for kw in role_keywords if kw.lower() not in normalized]
    
    match_percent = round((len(matched) / len(role_keywords)) * 100) if role_keywords else 0
    score = 40 + round(match_percent * 0.4)
    
    sections = ["experience", "projects", "education", "skills", "certifications", "summary"]
    found_sections = [sec for sec in sections if sec in normalized]
    score += len(found_sections) * 3
    
    word_count = len(normalized.split())
    if 100 < word_count < 600:
        score += 5
        
    ats_score = min(95, max(30, score))
    
    improvements = []
    if missing:
        improvements.append(f"Include missing key technologies: {', '.join(missing[:4])}.")
    if "project" not in normalized:
        improvements.append("Add a dedicated projects section detailing your technical accomplishments.")
    if "experience" not in normalized:
        improvements.append("Add a professional work or internship experience section.")
    if word_count < 150:
        improvements.append("Your resume is very short. Elaborate on your projects and professional achievements.")
    if word_count > 800:
        improvements.append("Your resume is quite long. Try keeping it under 2 pages for optimal ATS readability.")
        
    if not improvements:
        improvements.append("Perfect structure! Refine grammar and typography to maximize readability.")
        
    return {
        "atsScore": ats_score,
        "matchedKeywords": matched,
        "missingKeywords": missing,
        "improvements": improvements
    }


async def analyze_resume_ai(resume_text: str, role: str) -> dict:
    prompt = f"""
You are an expert ATS (Applicant Tracking System) resume analyzer.
Analyze the following resume text for the role of "{role}".

Resume Text:
\"\"\"
{resume_text}
\"\"\"

You MUST return ONLY a valid JSON object (with NO markdown formatting, no ```json blocks, just raw JSON) containing the following fields:
{{
  "atsScore": number (between 30 and 100),
  "improvements": array of strings (actionable items to improve the resume),
  "matchedKeywords": array of strings (skills/keywords found in resume),
  "missingKeywords": array of strings (important skills/keywords missing for the role)
}}
"""
    try:
        raw_result = await call_groq_model(
            model=FEEDBACK_MODEL or "groq-m3-large",
            prompt=prompt,
            max_new_tokens=500,
            temperature=0.3
        )
        
        extracted_text = extract_text(raw_result)
        parsed = parse_json_payload(extracted_text)
        
        if parsed and isinstance(parsed, dict) and "atsScore" in parsed and "improvements" in parsed:
            # Ensure proper schema formats
            return {
                "atsScore": int(parsed.get("atsScore", 70)),
                "improvements": list(parsed.get("improvements", [])),
                "matchedKeywords": list(parsed.get("matchedKeywords", [])),
                "missingKeywords": list(parsed.get("missingKeywords", []))
            }
    except Exception as e:
        print(f"Error calling Groq for resume analysis: {e}")
        
    # Fallback to local heuristic analyzer if AI request fails or is misformatted
    return run_local_analysis(resume_text, role)
