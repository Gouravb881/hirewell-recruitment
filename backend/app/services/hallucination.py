from __future__ import annotations


def detect_hallucination_flags(resume: dict) -> dict:
    flags = []
    severity = "green"
    dates = resume.get("dates", [])
    skills = resume.get("skills", [])
    achievements = resume.get("achievements", [])
    if len(dates) < 2:
        flags.append("Missing timeline detail")
    if len(skills) > 30 and len(achievements) < 2:
        flags.append("Possible skill inflation")
    # Simple overlap heuristic placeholder.
    if len(dates) >= 8:
        flags.append("Potential date overlap - manual review")

    if any("overlap" in f.lower() for f in flags):
        severity = "red"
    elif flags:
        severity = "yellow"

    confidence = 95.0
    if severity == "yellow":
        confidence = 78.0
    if severity == "red":
        confidence = 52.0

    return {"flags": flags, "label": severity, "confidence_score": confidence}
