from pydantic import BaseModel


class InterviewConfig(BaseModel):
    role: str
    difficulty: str
    duration: str
    language: str
    experience: str


class AnswerEvaluation(BaseModel):
    question: str
    answer: str
    role: str
    difficulty: str
    language: str
    experience: str


class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    role: str


class CodeRunRequest(BaseModel):
    code: str
    language: str
    questionTitle: str = ""
    testCases: list = []


class CodeEvaluationRequest(BaseModel):
    code: str
    language: str
    questionTitle: str = ""
