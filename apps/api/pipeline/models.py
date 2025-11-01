"""Pydantic models used by the pipeline."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class IngestResponse(BaseModel):
    document_id: str
    filename: str
    chunks_added: int
    characters: int
    mode: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    preview: Optional[str] = None


class SourceChunk(BaseModel):
    chunk_id: str
    document_id: str
    text: str
    score: float
    order: int


class SummaryRequest(BaseModel):
    query: str = Field(..., description="Natural language question or instruction for the summarizer.")
    mode: str = Field(
        default="universal",
        description="Summarization mode. Options: 'universal', 'legal'.",
    )
    style: str = Field(
        default="concise",
        description="Desired summary style such as 'bulleted', 'executive', 'action-items'.",
    )
    instructions: Optional[str] = Field(
        default=None,
        description="Optional custom instructions appended to the summarizer prompt.",
    )
    document_id: Optional[str] = Field(
        default=None,
        description="Limit retrieval to a specific document id. If omitted, search across all ingested content.",
    )
    max_sources: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Maximum number of source chunks included in the response.",
    )


class SummaryResponse(BaseModel):
    mode: str
    style: str
    summary: str
    sources: List[SourceChunk]


class DocumentRecord(BaseModel):
    document_id: str
    filename: str
    mode: str
    characters: int
    chunks: int
    created_at: datetime
