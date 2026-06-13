from fastapi import APIRouter, HTTPException

from schemas import AnswerEvaluation, InterviewConfig
from services.evaluation_service import evaluate_answer
from services.question_service import generate_questions

router = APIRouter(prefix="/api", tags=["AI"])


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "InterviewVerse AI"}


@router.post("/generate-questions")
async def generate_questions_endpoint(payload: InterviewConfig):
    try:
        questions = await generate_questions(payload)
        return {"success": True, "questions": questions}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/evaluate-answer")
async def evaluate_answer_endpoint(payload: AnswerEvaluation):
    try:
        evaluation = await evaluate_answer(payload)
        return {"success": True, "evaluation": evaluation}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
