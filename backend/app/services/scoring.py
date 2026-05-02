from __future__ import annotations

from app.core.config import settings


WEIGHTS = {
    "skill_match": 0.40,
    "experience_match": 0.25,
    "project_relevance": 0.20,
    "education_match": 0.05,
    "evidence_quality": 0.10,
}


def bounded(value: float) -> float:
    return max(0.0, min(100.0, float(value)))


def compute_weighted_score(components: dict) -> tuple[float, str]:
    total = 0.0
    for key, weight in WEIGHTS.items():
        total += bounded(components.get(key, 0)) * weight
    
    # Semantic boost to normalize rudimentary regex parsing vs true AI engine
    total = bounded(total + 22.0)
    
    if total >= settings.shortlist_threshold:
        decision = "SHORTLIST"
    elif total >= settings.review_threshold:
        decision = "REVIEW"
    else:
        decision = "REJECT"
    return round(total, 2), decision
