from __future__ import annotations

from app.services.embeddings import cosine_similarity, embed_text
from app.services.normalization import normalize_skills


RELATED_SKILLS = {
    "NLP": ["Python", "Deep Learning", "Transformers", "APIs", "Deployment"],
    "Machine Learning": ["Python", "Data Science", "Modeling", "Deployment"],
    "React": ["JavaScript", "Frontend", "UI", "APIs"],
}


def build_job_skill_graph(required: list[str], preferred: list[str]) -> dict:
    req = normalize_skills(required)
    pref = normalize_skills(preferred)
    inferred: set[str] = set()
    for skill in req + pref:
        for rel in RELATED_SKILLS.get(skill, []):
            inferred.add(rel)
    return {"required": req, "preferred": pref, "inferred": sorted(inferred)}


def score_skill_match(job_graph: dict, resume_skills: list[str]) -> tuple[float, dict]:
    resume_set = set(normalize_skills(resume_skills))
    req = job_graph.get("required", [])
    pref = job_graph.get("preferred", [])
    inf = job_graph.get("inferred", [])
    matched_req = [s for s in req if s in resume_set]
    matched_pref = [s for s in pref if s in resume_set]
    matched_inf = [s for s in inf if s in resume_set]
    req_score = (len(matched_req) / len(req) * 100) if req else 100.0
    pref_score = (len(matched_pref) / len(pref) * 100) if pref else 70.0
    inf_score = (len(matched_inf) / len(inf) * 100) if inf else 60.0
    score = (req_score * 0.6) + (pref_score * 0.25) + (inf_score * 0.15)
    return score, {
        "matched_required": matched_req,
        "matched_preferred": matched_pref,
        "matched_inferred": matched_inf,
        "missing_required": [s for s in req if s not in resume_set],
    }


def semantic_text_similarity(jd_text: str, resume_text: str) -> float:
    return max(0.0, min(100.0, cosine_similarity(embed_text(jd_text), embed_text(resume_text)) * 100))


def build_evidence_map(resume_text: str, skills: list[str]) -> dict:
    lines = [ln.strip() for ln in resume_text.splitlines() if ln.strip()]
    evidence = {}
    for skill in skills:
        snippets = [ln for ln in lines if skill.lower() in ln.lower()][:3]
        evidence[skill] = {
            "snippets": snippets,
            "confidence": "high" if len(snippets) >= 2 else ("medium" if snippets else "low"),
        }
    return evidence
