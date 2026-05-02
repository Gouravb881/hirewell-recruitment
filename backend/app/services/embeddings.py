from __future__ import annotations

import hashlib
from typing import Iterable

import numpy as np


def _hash_vec(text: str, dim: int = 128) -> np.ndarray:
    digest = hashlib.sha256(text.encode("utf-8", errors="ignore")).digest()
    base = np.frombuffer(digest, dtype=np.uint8).astype(np.float32)
    reps = int(np.ceil(dim / len(base)))
    vec = np.tile(base, reps)[:dim]
    norm = np.linalg.norm(vec)
    return vec / norm if norm else vec


def embed_text(text: str) -> np.ndarray:
    return _hash_vec(text or "")


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    denom = float(np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def batch_similarity(reference: str, candidates: Iterable[str]) -> list[float]:
    ref = embed_text(reference)
    return [cosine_similarity(ref, embed_text(c)) for c in candidates]
