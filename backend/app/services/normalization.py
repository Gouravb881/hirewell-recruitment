from __future__ import annotations

from dateutil import parser as date_parser


SKILL_ALIASES = {
    "js": "JavaScript",
    "reactjs": "React",
    "node.js": "Node",
    "ml": "Machine Learning",
    "ai": "Artificial Intelligence",
    "py": "Python",
}


def normalize_skill(skill: str) -> str:
    key = skill.strip().lower()
    return SKILL_ALIASES.get(key, skill.strip())


def normalize_skills(skills: list[str]) -> list[str]:
    return sorted({normalize_skill(s) for s in skills if s and s.strip()})


def normalize_date(value: str) -> str:
    if not value:
        return ""
    try:
        return date_parser.parse(value, fuzzy=True).date().isoformat()
    except Exception:
        return value


def normalize_entities(data: dict) -> dict:
    normalized = dict(data)
    normalized["skills"] = normalize_skills(data.get("skills", []))
    normalized["required_skills"] = normalize_skills(data.get("required_skills", []))
    normalized["preferred_skills"] = normalize_skills(data.get("preferred_skills", []))
    normalized["dates"] = [normalize_date(d) for d in data.get("dates", [])]
    return normalized
