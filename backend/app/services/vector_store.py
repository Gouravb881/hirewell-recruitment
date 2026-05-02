from __future__ import annotations

import numpy as np

from app.services.embeddings import embed_text

try:
    import faiss  # type: ignore
except Exception:  # pragma: no cover
    faiss = None


class VectorStore:
    def __init__(self, dim: int = 128):
        self.dim = dim
        self.ids: list[str] = []
        if faiss:
            self.index = faiss.IndexFlatIP(dim)
        else:
            self.index = None
            self.vectors: list[np.ndarray] = []

    def add_text(self, item_id: str, text: str) -> None:
        vec = embed_text(text).astype("float32").reshape(1, -1)
        self.ids.append(item_id)
        if self.index is not None:
            self.index.add(vec)
        else:
            self.vectors.append(vec[0])

    def search_text(self, text: str, k: int = 5) -> list[tuple[str, float]]:
        if not self.ids:
            return []
        query = embed_text(text).astype("float32").reshape(1, -1)
        if self.index is not None:
            scores, idxs = self.index.search(query, min(k, len(self.ids)))
            out = []
            for score, idx in zip(scores[0], idxs[0]):
                if idx >= 0:
                    out.append((self.ids[idx], float(score)))
            return out
        sims = [(self.ids[i], float(np.dot(query[0], self.vectors[i]))) for i in range(len(self.ids))]
        sims.sort(key=lambda x: x[1], reverse=True)
        return sims[:k]


vector_store = VectorStore()
