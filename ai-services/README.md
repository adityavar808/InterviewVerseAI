# AI Services

This folder contains the Python FastAPI microservice used by InterviewVerseAI for generating interview questions and evaluating candidate answers.

## Setup

1. Create a Python virtual environment in `ai-services`.
2. Install dependencies:

```bash
cd ai-services
python -m pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and set your Groq API key:

```bash
cd ai-services
copy .env.example .env
```

Then edit `ai-services/.env` with your real key:

```bash
GROQ_API_KEY=your_groq_key_here
GROQ_QUESTION_MODEL=groq-m3-large
GROQ_SCORE_MODEL=groq-m3-large
GROQ_FEEDBACK_MODEL=groq-m3-large
GROQ_API_URL=https://api.groq.com/v1
```

4. Start the FastAPI service:

```bash
cd ai-services
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

- `GET /api/health` - service health check
- `POST /api/generate-questions` - generate structured interview questions
- `POST /api/evaluate-answer` - evaluate a candidate answer and return score plus feedback

## Backend Integration

The backend Node API calls this Python service via `backend/src/services/aiPython.service.js`. Use environment variable `AI_SERVICE_URL` in `backend/.env` if the service is hosted elsewhere, otherwise it defaults to `http://127.0.0.1:8000`.

## Recommended Backend Environment Variables

Add or update in `backend/.env`:

```bash
AI_SERVICE_URL=http://127.0.0.1:8000
```

## Notes

- The Python service is now the single source of truth for AI question generation and answer evaluation.
- The Node backend sends requests to FastAPI instead of importing internal JS AI helper modules.
- Keep `GROQ_API_KEY` in the Python service environment so FastAPI can call Groq.

## Troubleshooting

- If you see `Missing GROQ_API_KEY` errors when calling `/api/generate-questions`, ensure `.env` exists and contains a valid key.
- Copy `.env.example` to `.env` in `ai-services` if needed.
- If the backend reports `AI service request failed`, verify FastAPI is running on port `8000` and the backend is configured with `AI_SERVICE_URL=http://127.0.0.1:8000` in `backend/.env`.
- If your machine uses a proxy or restricted network, the AI service honors environment proxy settings for outbound requests to Groq.
- If you see DNS or `getaddrinfo failed` errors, verify that `HTTPS_PROXY` / `HTTP_PROXY` are set correctly and that the selected host is reachable from your network.
