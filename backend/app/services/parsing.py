from __future__ import annotations

import io
import re
from typing import Any

from docx import Document
from pypdf import PdfReader


SKILL_HINTS = [
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "golang",
    "react",
    "node.js",
    "node",
    "machine learning",
    "deep learning",
    "nlp",
    "computer vision",
    "transformers",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "pandas",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "sql",
    "nosql",
    "mongodb",
    "postgres",
    "system design",
    "agile",
    "communication",
    "leadership",
    "problem solving",
    "strategic planning"

]


def extract_text(file_name: str, content: bytes) -> str:
    lower = file_name.lower()
    if lower.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
    if lower.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        return "\n".join((p.extract_text() or "") for p in reader.pages)
    if lower.endswith(".docx"):
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    return content.decode("utf-8", errors="ignore")


def _extract_skills(text: str) -> list[str]:
    found: list[str] = []
    text_l = text.lower()
    for hint in SKILL_HINTS:
        if hint in text_l:
            found.append(hint.title() if hint != "nlp" else "NLP")
    return found


def parse_resume(text: str) -> dict[str, Any]:
    email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    phone_match = re.search(r"(\+?\d[\d\-\s]{8,}\d)", text)
    years_matches = re.findall(r"(\d+)\+?\s*(?:years|yrs|y\.o\.)", text, flags=re.IGNORECASE)
    years = max([float(x) for x in years_matches], default=0.0)
    dates = re.findall(r"(?:\b20\d{2}\b)", text)
    if years == 0.0 and dates:
        years = max(0.0, float(2025 - min([int(d) for d in dates])))
        
    return {
        "name": text.splitlines()[0].strip() if text.strip() else "Unknown",
        "email": email_match.group(0) if email_match else "",
        "phone": phone_match.group(0) if phone_match else "",
        "total_experience": years,
        "skills": _extract_skills(text),
        "education": [],
        "certifications": [],
        "projects": [],
        "companies": [],
        "dates": re.findall(r"(?:\b\d{4}\b)", text),
        "achievements": [],
        "raw_text": text,
    }


def parse_jd(text: str, title: str = "") -> dict[str, Any]:
    years_matches = re.findall(r"(\d+)\+?\s*(?:years|yrs|y\.o\.)", text, flags=re.IGNORECASE)
    years = max([float(x) for x in years_matches], default=0.0)
    required = _extract_skills(text)
    preferred = [s for s in ["Leadership", "Communication", "System Design"] if s.lower() in text.lower()]
    responsibilities = [ln.strip("- ").strip() for ln in text.splitlines() if ln.strip().startswith("-")]
    return {
        "job_title": title,
        "years_required": years,
        "required_skills": required,
        "preferred_skills": preferred,
        "responsibilities": responsibilities[:10],
        "domain_knowledge": [],
        "tools_frameworks": required,
        "soft_skills": [s for s in ["Leadership", "Communication", "Ownership"] if s in preferred or s.lower() in text.lower()],
        "raw_text": text,
    }
