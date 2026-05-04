from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db import Candidate, Job, MatchResult, get_db
from app.schemas.models import CandidateCreate, CandidateOut, JobCreate, JobOut, MatchOut
from app.services.hallucination import detect_hallucination_flags
from app.services.normalization import normalize_entities
from app.services.parsing import extract_text, parse_jd, parse_resume
from app.services.scoring import compute_weighted_score
from app.services.semantic import build_evidence_map, build_job_skill_graph, score_skill_match, semantic_text_similarity
from app.services.vector_store import vector_store

router = APIRouter()
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
MAX_FILE_BYTES = 10 * 1024 * 1024


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/jobs", response_model=JobOut)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    if len(payload.jd) < 200:
        raise HTTPException(status_code=400, detail="Job description is too short.")
    
    parsed = parse_jd(payload.jd, payload.title)
    normalized = normalize_entities(parsed | {"required_skills": payload.required_skills, "preferred_skills": payload.preferred_skills})
    graph = build_job_skill_graph(
        normalized.get("required_skills", parsed.get("required_skills", [])),
        normalized.get("preferred_skills", parsed.get("preferred_skills", [])),
    )
    job = Job(
        title=payload.title,
        department=payload.department,
        years_required=float(payload.experience or parsed.get("years_required", 0)),
        location=payload.location,
        work_mode=payload.work_mode,
        salary_band=payload.salary_band,
        jd_text=payload.jd,
        parsed=parsed,
        skill_graph=graph,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    vector_store.add_text(f"job:{job.id}", job.jd_text)
    return JobOut(
        id=job.id,
        title=job.title,
        department=job.department,
        years_required=job.years_required,
        location=job.location,
        jd_text=job.jd_text,
        parsed=job.parsed,
        skill_graph=job.skill_graph,
    )


@router.post("/candidates", response_model=CandidateOut)
async def create_candidate(
    job_id: int = Form(...),
    portfolio_url: str = Form(""),
    github_url: str = Form(""),
    linkedin_url: str = Form(""),
    cover_letter: str = Form(""),
    resume_text: str = Form(""),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    file_name = file.filename if file else "resume.txt"
    final_text = resume_text
    if file:
        lower = file.filename.lower()
        if not any(lower.endswith(ext) for ext in ALLOWED_EXTENSIONS):
            raise HTTPException(status_code=400, detail="Unsupported file type")
        content = await file.read()
        if len(content) > MAX_FILE_BYTES:
            raise HTTPException(status_code=400, detail="File too large")
        final_text = extract_text(file.filename, content)
        
    if not final_text or len(final_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text is empty or unreadable.")
        
    resume_signals = ["experience", "education", "skills", "projects", "email", "phone"]
    found_signals = [word for word in resume_signals if word in final_text.lower()]
    if len(found_signals) < 1:
        # Just a warning/log in real life, but we will let it pass for robustness
        pass

    parsed = parse_resume(final_text)
    normalized = normalize_entities(parsed)
    candidate = Candidate(
        job_id=job_id,
        file_name=file_name,
        resume_text=final_text,
        portfolio_url=portfolio_url,
        github_url=github_url,
        linkedin_url=linkedin_url,
        cover_letter=cover_letter,
        parsed=parsed,
        normalized=normalized,
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    vector_store.add_text(f"candidate:{candidate.id}", final_text)
    return CandidateOut(
        id=candidate.id,
        job_id=candidate.job_id,
        file_name=candidate.file_name,
        parsed=candidate.parsed,
        normalized=candidate.normalized,
    )


@router.get("/candidates")
def list_candidates(job_id: int, db: Session = Depends(get_db)):
    items = db.query(Candidate).filter(Candidate.job_id == job_id).all()
    return [
        {
            "id": c.id,
            "job_id": c.job_id,
            "file_name": c.file_name,
            "parsed": c.parsed,
            "normalized": c.normalized,
        }
        for c in items
    ]


@router.post("/match/batch/{job_id}")
def match_batch(job_id: int, db: Session = Depends(get_db)):
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).all()
    results = []
    for cand in candidates:
        results.append(match_candidate(job_id, cand.id, db))
    return results


@router.post("/match/{job_id}/{candidate_id}", response_model=MatchOut)
def match_candidate(job_id: int, candidate_id: int, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    candidate = db.get(Candidate, candidate_id)
    if not job or not candidate:
        raise HTTPException(status_code=404, detail="Job or candidate not found")

    skill_score, skill_details = score_skill_match(job.skill_graph, candidate.normalized.get("skills", []))
    exp_candidate = float(candidate.normalized.get("total_experience", 0))
    exp_required = float(job.years_required or 0)
    exp_score = 100.0 if exp_required <= 0 else min(100.0, (exp_candidate / exp_required) * 100.0)
    semantic_score = semantic_text_similarity(job.jd_text, candidate.resume_text)

    components = {
        "skill_match": skill_score,
        "experience_match": exp_score,
        "project_relevance": semantic_score,
        "education_match": 85.0,
        "evidence_quality": 80.0,
    }
    final_score, decision = compute_weighted_score(components)
    hallucination = detect_hallucination_flags(candidate.normalized)
    evidence = build_evidence_map(candidate.resume_text, job.skill_graph.get("required", []))
    explainability = {
        "matched": skill_details.get("matched_required", []),
        "missing": skill_details.get("missing_required", []),
        "evidence": evidence,
        "components": components,
    }

    result = MatchResult(
        job_id=job_id,
        candidate_id=candidate_id,
        final_score=final_score,
        decision=decision,
        confidence_score=hallucination["confidence_score"],
        confidence_label=hallucination["label"],
        score_breakdown=components,
        explainability=explainability,
        hallucination_flags=hallucination,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return MatchOut(
        id=result.id,
        job_id=result.job_id,
        candidate_id=result.candidate_id,
        final_score=result.final_score,
        decision=result.decision,
        confidence_score=result.confidence_score,
        confidence_label=result.confidence_label,
        score_breakdown=result.score_breakdown,
        explainability=result.explainability,
        hallucination_flags=result.hallucination_flags,
    )


@router.get("/matches")
def list_matches(job_id: int, db: Session = Depends(get_db)):
    items = db.query(MatchResult).filter(MatchResult.job_id == job_id).all()
    return [
        {
            "id": m.id,
            "job_id": m.job_id,
            "candidate_id": m.candidate_id,
            "final_score": m.final_score,
            "decision": m.decision,
            "confidence_score": m.confidence_score,
            "confidence_label": m.confidence_label,
            "score_breakdown": m.score_breakdown,
            "explainability": m.explainability,
            "hallucination_flags": m.hallucination_flags,
        }
        for m in items
    ]
