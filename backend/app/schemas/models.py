from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str
    department: str = ""
    experience: float = 0
    location: str = ""
    work_mode: str = ""
    salary_band: str = ""
    jd: str = ""
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)


class JobOut(BaseModel):
    id: int
    title: str
    department: str
    years_required: float
    location: str
    jd_text: str
    parsed: dict
    skill_graph: dict


class CandidateCreate(BaseModel):
    job_id: int
    portfolio_url: str = ""
    github_url: str = ""
    linkedin_url: str = ""
    cover_letter: str = ""
    resume_text: str = ""
    file_name: str = "resume.txt"


class CandidateOut(BaseModel):
    id: int
    job_id: int
    file_name: str
    parsed: dict
    normalized: dict


class MatchOut(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    final_score: float
    decision: str
    confidence_score: float
    confidence_label: str
    score_breakdown: dict
    explainability: dict
    hallucination_flags: dict
