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
