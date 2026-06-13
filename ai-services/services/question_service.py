import json
import re
from typing import List

from config import QUESTION_MODEL
from groq_client import call_groq_model
from schemas import InterviewConfig


def extract_text(result):
    if isinstance(result, str):
        return result.strip()

    if isinstance(result, dict):
        if isinstance(result.get("text"), str):
            return result["text"].strip()

        choices = result.get("choices")
        if isinstance(choices, list) and len(choices) > 0:
            message = choices[0].get("message", {})
            content = message.get("content")
            if isinstance(content, str):
                return content.strip()

        if isinstance(result.get("generated_text"), str):
            return result["generated_text"].strip()

        if isinstance(result.get("output_text"), str):
            return result["output_text"].strip()

        if isinstance(result.get("output"), list):
            return extract_text(result["output"])

    if isinstance(result, list) and len(result) > 0:
        return extract_text(result[0])

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
    candidates = []

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
                        parsed = json.loads(candidate)
                        candidates.append(parsed)
                    except json.JSONDecodeError:
                        pass
                    start_index = None
        escape = char == "\\" and not escape

    if not candidates:
        return None

    def is_question_object(obj):
        if isinstance(obj, dict):
            return any(key in obj for key in ("question", "questions", "category", "difficulty", "type", "tags"))
        if isinstance(obj, list) and obj:
            return all(isinstance(item, dict) for item in obj)
        return False

    for candidate in candidates:
        if is_question_object(candidate):
            if isinstance(candidate, list):
                return candidate
            if isinstance(candidate, dict) and any(k in candidate for k in ("questions", "items", "data", "question")):
                return candidate

    # prefer the largest parsed object/list as a fallback
    return max(candidates, key=lambda obj: len(obj) if hasattr(obj, "__len__") else 0)


def parse_json_payload(text):
    text = clean_json_text(text)
    if not text:
        return None

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        candidate = find_balanced_json(text)
        if candidate is not None:
            if (
                isinstance(candidate, list)
                and all(isinstance(item, str) for item in candidate)
                and re.search(r'["\']?question["\']?\s*:', text, flags=re.IGNORECASE)
            ):
                candidate = None
            else:
                return candidate

        sanitized = re.sub(r",\s*([\]}])", r"\1", text)
        try:
            return json.loads(sanitized)
        except json.JSONDecodeError:
            pass

    return None


def parse_json_like_objects(text: str) -> List[dict]:
    def parse_value(raw_value: str):
        value = raw_value.strip()
        if value.endswith(','):
            value = value[:-1].strip()
        if value.startswith('"') and value.endswith('"'):
            return value[1:-1]
        if value.startswith('[') and value.endswith(']'):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                tags = re.findall(r'"([^\"]+)"', value)
                return tags
        return value

    objects = []
    current = {}

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith('{') or line.startswith('}') or line.startswith('[') or line.startswith(']'):
            continue

        match = re.match(r'^["\']?(question|category|difficulty|type|tags)["\']?\s*:\s*(.+)$', line, flags=re.IGNORECASE)
        if not match:
            continue

        key = match.group(1).lower()
        value = parse_value(match.group(2))

        if key == 'question' and current:
            objects.append(current)
            current = {}

        current[key] = value

    if current:
        objects.append(current)

    return objects


def extract_question_lines(text: str) -> List[str]:
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if re.match(r"^(output|json|questions|response|result)[:\s]", line, flags=re.IGNORECASE):
            continue
        if re.match(r'^["\']?(question|category|difficulty|type|tags)["\']?\s*:', line, flags=re.IGNORECASE):
            continue
        if line.startswith('{') or line.startswith('}') or line.startswith('[') or line.startswith(']'):
            continue
        line = re.sub(r"^[\-\*\u2022]\s*", "", line)
        line = re.sub(r"^\d+[\.\)]\s*", "", line)
        if len(line) < 15:
            continue
        lines.append(line)

    if len(lines) >= 3:
        return lines
    return []


def normalize_questions(raw_output, config: InterviewConfig) -> List[dict]:
    text = extract_text(raw_output)
    parsed = parse_json_payload(text)
    questions: List[dict] = []

    if parsed is None:
        parsed = parse_json_like_objects(text)

    if isinstance(parsed, list) and parsed and all(isinstance(item, dict) for item in parsed):
        if all(
            isinstance(item.get("question"), str)
            and re.match(r'^\s*["\']?(category|difficulty|type|tags)["\']?\s*:', item.get("question"))
            for item in parsed
        ):
            parsed = parse_json_like_objects(text)

    if isinstance(parsed, dict):
        candidate = parsed.get("questions") or parsed.get("items") or parsed.get("data")
        if isinstance(candidate, list):
            parsed = candidate
        elif isinstance(candidate, str):
            parsed = extract_question_lines(candidate)
        else:
            parsed = [parsed] if parsed else []

    if isinstance(parsed, list) and parsed and all(isinstance(item, str) for item in parsed):
        parsed = [{"question": item} for item in parsed]

    if isinstance(parsed, list):
        for item in parsed:
            if isinstance(item, str):
                item = {"question": item}
            if not isinstance(item, dict):
                continue
            questions.append(
                {
                    "question": str(
                        item.get("question") or item.get("prompt") or item.get("text") or item.get("title") or "Untitled question"
                    ).strip(),
                    "category": str(item.get("category") or item.get("type") or "General").strip(),
                    "difficulty": str(item.get("difficulty") or config.difficulty or "Medium").strip(),
                    "type": str(item.get("type") or "Open-ended").strip(),
                    "tags": [
                        str(tag).strip() for tag in item.get("tags") if isinstance(tag, str)
                    ]
                    if isinstance(item.get("tags"), list)
                    else [config.role],
                }
            )

    if not questions:
        fallback_lines = extract_question_lines(text)
        for line in fallback_lines[:10]:
            questions.append(
                {
                    "question": line,
                    "category": "General",
                    "difficulty": config.difficulty or "Medium",
                    "type": "Open-ended",
                    "tags": [config.role],
                }
            )

    return questions


async def generate_questions(config: InterviewConfig) -> List[dict]:
    prompt = (
        f"You are an expert interviewer and question writer. Generate the best possible set of 10 interview questions "
        f"tailored to the following candidate profile and session settings. Return only valid JSON without any explanation, "
        f"markdown, or extra text. The output must be a plain JSON array containing exactly 10 objects. Each object "
        f"should include: question, category, difficulty, type, and tags.\n\n"
        f"Role: {config.role}\n"
        f"Difficulty: {config.difficulty}\n"
        f"Duration: {config.duration}\n"
        f"Language: {config.language}\n"
        f"Experience: {config.experience}\n\n"
        f"Make the questions practical, relevant, and varied across behavioral, technical, and scenario-based prompts. "
        f"Use the requested interview language and keep them suitable for the selected experience level."
    )

    raw = await call_groq_model(
        QUESTION_MODEL,
        prompt,
        max_new_tokens=700,
        temperature=0.7,
    )

    questions = normalize_questions(raw, config)
    if not questions:
        raise ValueError("AI response did not contain a valid question list")
    return questions
