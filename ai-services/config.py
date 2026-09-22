from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables from the ai-services/.env file even when uvicorn
# is started from a different working directory.
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY") or ""
QUESTION_MODEL = os.getenv("GROQ_QUESTION_MODEL", "openai/gpt-oss-20b")
SCORE_MODEL = os.getenv("GROQ_SCORE_MODEL", "openai/gpt-oss-20b")
FEEDBACK_MODEL = os.getenv("GROQ_FEEDBACK_MODEL", "openai/gpt-oss-20b")
GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1")
AI_SERVICE_HOST = os.getenv("AI_SERVICE_HOST", "127.0.0.1")
AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", "8000"))