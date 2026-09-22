import json
import re

from config import SCORE_MODEL, FEEDBACK_MODEL
from groq_client import call_groq_model
from schemas import AnswerEvaluation


def extract_text(result):
    if isinstance(result, str):
        return result.strip()

    if isinstance(result, dict):

        # Groq Chat Completions response
        choices = result.get("choices")
        if isinstance(choices, list) and len(choices) > 0:
            message = choices[0].get("message", {})
            content = message.get("content")

            if isinstance(content, str):
                return content.strip()

        # Fallback formats
        if isinstance(result.get("generated_text"), str):
            return result["generated_text"].strip()

        if isinstance(result.get("text"), str):
            return result["text"].strip()

        if isinstance(result.get("output_text"), str):
            return result["output_text"].strip()

    return str(result).strip()


def clean_json_text(text: str) -> str:
    text = text.strip()
    if not text:
        return text

    text = re.sub(r"```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = text.replace("```", "").strip()
    return text


def find_balanced_json(text: str):
    stack = []
    in_string = False
    escape = False
    start_index = None

    for idx, char in enumerate(text):
        if char == "\\" and not escape:
            escape = True
            continue

        if char == '"' and not escape:
            in_string = not in_string

        if not in_string:
            if char in "[{":
                if start_index is None:
                    start_index = idx
                stack.append(char)
            elif char in "]}" and stack:
                open_char = stack.pop()
                if (open_char, char) not in (("{", "}"), ("[", "]")):
                    stack.clear()
                    start_index = None
                elif not stack and start_index is not None:
                    candidate = text[start_index : idx + 1]
                    try:
                        return json.loads(candidate)
                    except json.JSONDecodeError:
                        start_index = None
        escape = char == "\\" and not escape

    return None


def parse_json_payload(text):
    text = clean_json_text(text)
    if not text:
        return None

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        parsed = find_balanced_json(text)
        if parsed is None:
            sanitized = re.sub(r",\s*([\]}])", r"\1", text)
            try:
                parsed = json.loads(sanitized)
            except json.JSONDecodeError:
                return None

    if isinstance(parsed, dict):
        return parsed
    if isinstance(parsed, list):
        for item in parsed:
            if isinstance(item, dict):
                return item
    return None


def parse_int_value(value, fallback=0):
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return fallback
        percent_match = re.search(r"(\d{1,3})\s*%", value)
        if percent_match:
            return int(percent_match.group(1))
        number_match = re.search(r"-?\d+", value)
        if number_match:
            return int(number_match.group(0))
    return fallback


def parse_score(text):
    numbers = re.findall(r"\b(\d{1,3})\b", text)

    if not numbers:
        return 0

    score = int(numbers[0])

    return max(0, min(100, score))


def extract_clean_feedback(text: str, json_data: dict) -> str:
    if isinstance(json_data, dict) and "feedback" in json_data and isinstance(json_data["feedback"], str):
        fb = json_data["feedback"].strip()
        if fb:
            return fb

    if not text:
        return "No feedback provided."

    text_str = str(text).strip()

    # Remove markdown code fences
    cleaned = re.sub(r"^```(?:json)?\s*", "", text_str, flags=re.IGNORECASE)
    cleaned = re.sub(r"```\s*$", "", cleaned, flags=re.IGNORECASE).strip()

    # Try regex match for "feedback": "..."
    feedback_match = re.search(r'"feedback"\s*:\s*"(.*?)"(?:\s*\}|\s*,\s*"|$)', cleaned, re.DOTALL)
    if not feedback_match:
        feedback_match = re.search(r'"feedback"\s*:\s*"(.*?)"', cleaned, re.DOTALL)

    if feedback_match:
        extracted = feedback_match.group(1).replace('\\"', '"').replace('\\n', '\n').strip()
        if extracted:
            return extracted

    # Clean leftover wrappers
    cleaned = re.sub(r'^\s*\{\s*"feedback"\s*:\s*"?', "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'"?\s*\}\s*$', "", cleaned).strip()
    cleaned = cleaned.replace('\\"', '"').strip()

    return cleaned if cleaned else text_str


async def evaluate_answer(config: AnswerEvaluation) -> dict:
    score_prompt = (
        f"You are an AI interviewer. Evaluate the following answer and provide a JSON object with fields: "
        f"score (0-100), communication, technical, and confidence. Only return valid JSON.\n\n"
        f"Question: {config.question}\n"
        f"Answer: {config.answer}\n\n"
        f"Context:\n"
        f"Role: {config.role}\n"
        f"Difficulty: {config.difficulty}\n"
        f"Language: {config.language}\n"
        f"Experience: {config.experience}"
    )

    feedback_prompt = (
        f"You are an expert interview coach. Review the candidate's answer and provide brief, constructive feedback "
        f"in JSON format with a single field called feedback.\n\n"
        f"Question: {config.question}\n"
        f"Answer: {config.answer}\n\n"
        f"Context:\n"
        f"Role: {config.role}\n"
        f"Difficulty: {config.difficulty}\n"
        f"Language: {config.language}\n"
        f"Experience: {config.experience}"
    )

    score_raw = await call_groq_model(
        SCORE_MODEL,
        score_prompt,
        max_new_tokens=1500,
        temperature=0.3,
    )

    feedback_raw = await call_groq_model(
        FEEDBACK_MODEL,
        feedback_prompt,
        max_new_tokens=1500,
        temperature=0.7,
    )

    score_text = extract_text(score_raw)
    feedback_text = extract_text(feedback_raw)

    score_json = parse_json_payload(score_text) or {}
    feedback_json = parse_json_payload(feedback_text) or {}

    score = parse_int_value(score_json.get("score"), parse_score(score_text))
    communication = parse_int_value(score_json.get("communication"), 0)
    technical = parse_int_value(score_json.get("technical"), 0)
    confidence = parse_int_value(score_json.get("confidence"), 0)

    feedback = extract_clean_feedback(feedback_text, feedback_json)

    return {
        "score": max(0, min(100, score)),
        "communication": communication,
        "technical": technical,
        "confidence": confidence,
        "feedback": feedback,
        "raw": {
            "score": score_text,
            "feedback": feedback_text,
        },
    }