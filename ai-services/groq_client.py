import json
import socket

import httpx

from config import GROQ_API_KEY, GROQ_API_URL


async def call_groq_model(
    model: str,
    prompt: str,
    max_new_tokens: int = 250,
    temperature: float = 0.7,
    top_p: float = 0.9,
):
    if not model:
        raise RuntimeError("Missing model name.")
    if not GROQ_API_KEY:
        raise RuntimeError("Missing GROQ_API_KEY environment variable.")

    url = f"{GROQ_API_URL.rstrip('/')}/chat/completions"
    payload = {
    "model": model,
    "messages": [
        {
            "role": "user",
            "content": prompt
        }
    ],
    "max_tokens": max_new_tokens,
    "temperature": temperature,
    "top_p": top_p,
}
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=120.0, trust_env=True) as client:
            response = await client.post(url, json=payload, headers=headers)
    except httpx.RequestError as request_error:
        cause = getattr(request_error, "__cause__", None)
        host_error = "DNS lookup failed. Check your internet connection or proxy settings (HTTP_PROXY / HTTPS_PROXY)."
        if isinstance(cause, socket.gaierror):
            raise RuntimeError(
                f"Groq request failed when connecting to {url}: {request_error}. {host_error}"
            )
        raise RuntimeError(
            f"Groq request failed when connecting to {url}: {request_error}. "
            "Verify internet access, proxy settings, and that the host is reachable."
        )

    if response.status_code >= 400:
        try:
            details = response.json()
        except json.JSONDecodeError:
            details = response.text
        raise RuntimeError(f"API error ({response.status_code}): {details}")

    try:
        return response.json()
    except json.JSONDecodeError:
        return response.text