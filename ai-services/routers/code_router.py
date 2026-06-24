from fastapi import APIRouter, HTTPException
from schemas import CodeRunRequest, CodeEvaluationRequest
from services.code_service import run_code_ai, evaluate_code_ai

router = APIRouter(prefix="/api", tags=["Coding"])

@router.post("/run-code")
async def run_code_endpoint(payload: CodeRunRequest):
    try:
        result = await run_code_ai(
            code=payload.code,
            language=payload.language,
            question_title=payload.questionTitle,
            test_cases=payload.testCases
        )
        return {"success": True, "result": result}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/evaluate-code")
async def evaluate_code_endpoint(payload: CodeEvaluationRequest):
    try:
        result = await evaluate_code_ai(
            code=payload.code,
            language=payload.language,
            question_title=payload.questionTitle
        )
        return {"success": True, "result": result}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
