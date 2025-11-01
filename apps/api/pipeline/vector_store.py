"""Simple in-memory vector store backed by FAISS."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Sequence

import faiss  # type: ignore
import numpy as np


@dataclass
class ChunkRecord:
    chunk_id: str
    document_id: str
    text: str
    metadata: Dict[str, str] = field(default_factory=dict)


class InMemoryVectorStore:
    def __init__(self, dimension: int):
        self._index = faiss.IndexFlatL2(dimension)
        self._chunks: List[ChunkRecord] = []

    @property
    def size(self) -> int:
        return len(self._chunks)

    def add(self, embeddings: np.ndarray, records: Sequence[ChunkRecord]) -> List[int]:
        if not len(embeddings):
            return []

        if embeddings.dtype != np.float32:
            embeddings = embeddings.astype("float32")

        self._index.add(embeddings)
        start_idx = len(self._chunks)
        self._chunks.extend(records)
        return list(range(start_idx, len(self._chunks)))

    def search(
        self,
        vector: np.ndarray,
        top_k: int,
        *,
        filter_document_id: Optional[str] = None,
        oversample: int = 3,
    ) -> List[tuple[ChunkRecord, float]]:
        if self.size == 0:
            return []

        if vector.dtype != np.float32:
            vector = vector.astype("float32")

        query = vector.reshape(1, -1)
        k = min(max(top_k * max(oversample, 1), top_k), self.size)
        distances, indices = self._index.search(query, k)

        results: List[tuple[ChunkRecord, float]] = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx < 0 or idx >= self.size:
                continue
            record = self._chunks[idx]
            if filter_document_id and record.document_id != filter_document_id:
                continue
            results.append((record, float(distance)))
            if len(results) >= top_k:
                break

        return results

    def clear(self) -> None:
        dimension = self._index.d
        self._index = faiss.IndexFlatL2(dimension)
        self._chunks.clear()


__all__ = ["InMemoryVectorStore", "ChunkRecord"]
