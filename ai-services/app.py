from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.interview_router import router as interview_router

app = FastAPI(
    title="InterviewVerse AI Service",
    description="FastAPI microservice for generating interview questions and evaluating candidate answers.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_router)
