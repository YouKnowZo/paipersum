"""High-level service orchestrating document ingestion and summarization."""

from __future__ import annotations

import textwrap
import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List

import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import pipeline as hf_pipeline

from . import chunker, extractors
from .config import settings
from .models import DocumentRecord, IngestResponse, SourceChunk, SummaryRequest, SummaryResponse
from .prompts import build_prompt
from .vector_store import ChunkRecord, InMemoryVectorStore


@dataclass
class _DocumentState:
    document_id: str
    filename: str
    mode: str
    characters: int
    chunks: int
    created_at: datetime


embedder = SentenceTransformer(settings.embed_model_name)
vector_store = InMemoryVectorStore(embedder.get_sentence_embedding_dimension())
summarizer = hf_pipeline("summarization", model=settings.summarizer_model_name, device=-1)

_documents: Dict[str, _DocumentState] = {}


def ingest_upload(filename: str, payload: bytes, *, mode: str = "universal") -> IngestResponse:
    """Extract text, chunk, embed, and store in the vector index."""

    text = extractors.extract_text_from_bytes(filename, payload)
    characters = len(text)
    chunks = chunker.chunk_text(
        text,
        max_chars=settings.chunk_max_chars,
        overlap=settings.chunk_overlap_chars,
    )

    if not chunks:
        return IngestResponse(
            document_id=str(uuid.uuid4()),
            filename=filename,
            chunks_added=0,
            characters=characters,
            mode=mode,
            preview="",
        )

    embeddings = embedder.encode(chunks, convert_to_numpy=True)

    document_id = str(uuid.uuid4())
    records: List[ChunkRecord] = []
    for chunk_text in chunks:
        records.append(
            ChunkRecord(
                chunk_id=str(uuid.uuid4()),
                document_id=document_id,
                text=chunk_text,
                metadata={"mode": mode, "filename": filename},
            )
        )

    vector_store.add(np.array(embeddings), records)

    doc_state = _DocumentState(
        document_id=document_id,
        filename=filename,
        mode=mode,
        characters=characters,
        chunks=len(chunks),
        created_at=datetime.utcnow(),
    )
    _documents[document_id] = doc_state

    preview = textwrap.shorten(text, width=320, placeholder="…") if text else ""

    return IngestResponse(
        document_id=document_id,
        filename=filename,
        chunks_added=len(chunks),
        characters=characters,
        mode=mode,
        preview=preview,
    )


def _format_sources(chunks: List[SourceChunk], max_chars: int) -> str:
    formatted: List[str] = []
    remaining = max_chars

    for chunk in chunks:
        if remaining <= 0:
            break

        snippet = chunk.text.replace("\n", " ").strip()
        if remaining <= 15:
            break
        if len(snippet) > remaining:
            snippet = textwrap.shorten(snippet, width=remaining, placeholder="…")
        formatted.append(f"[S{chunk.order}] {snippet}")
        remaining -= len(formatted[-1])

    return "\n".join(formatted)


def query_summary(payload: SummaryRequest) -> SummaryResponse:
    if vector_store.size == 0:
        return SummaryResponse(mode=payload.mode, style=payload.style, summary="No documents have been ingested yet.", sources=[])

    query_embedding = embedder.encode([payload.query])[0]

    search_results = vector_store.search(
        np.array(query_embedding),
        top_k=payload.max_sources,
        filter_document_id=payload.document_id,
        oversample=settings.retrieval_scoring_multiplier,
    )

    if not search_results:
        return SummaryResponse(mode=payload.mode, style=payload.style, summary="No relevant context found for the query.", sources=[])

    sources: List[SourceChunk] = []
    for order, (record, score) in enumerate(search_results, start=1):
        sources.append(
            SourceChunk(
                chunk_id=record.chunk_id,
                document_id=record.document_id,
                text=record.text,
                score=score,
                order=order,
            )
        )

    prompt = build_prompt(payload.mode, payload.style, payload.instructions)
    model_input = (
        f"{prompt}\n\n"
        f"Context sources:\n{_format_sources(sources, settings.max_context_chars)}\n\n"
        f"Query: {payload.query}\nResponse:"
    )

    summary_output = summarizer(
        model_input,
        max_length=220,
        min_length=40,
        do_sample=False,
        truncation=True,
    )

    summary_text = summary_output[0]["summary_text"].strip()

    return SummaryResponse(
        mode=payload.mode,
        style=payload.style,
        summary=summary_text,
        sources=sources,
    )


def list_documents() -> List[DocumentRecord]:
    return [
        DocumentRecord(
            document_id=doc.document_id,
            filename=doc.filename,
            mode=doc.mode,
            characters=doc.characters,
            chunks=doc.chunks,
            created_at=doc.created_at,
        )
        for doc in sorted(_documents.values(), key=lambda d: d.created_at, reverse=True)
    ]


def clear_documents() -> None:
    _documents.clear()
    vector_store.clear()


__all__ = [
    "ingest_upload",
    "query_summary",
    "list_documents",
    "clear_documents",
]
