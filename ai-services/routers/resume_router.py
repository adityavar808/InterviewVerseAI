from fastapi import APIRouter, HTTPException
from schemas import ResumeAnalysisRequest
from services.resume_service import analyze_resume_ai

router = APIRouter(prefix="/api", tags=["Resume"])


@router.post("/analyze-resume")
async def analyze_resume_endpoint(payload: ResumeAnalysisRequest):
    try:
        result = await analyze_resume_ai(payload.resume_text, payload.role)
        return {
            "success": True,
            "atsScore": result["atsScore"],
            "improvements": result["improvements"],
            "matchedKeywords": result["matchedKeywords"],
            "missingKeywords": result["missingKeywords"]
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
