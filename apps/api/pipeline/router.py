"""FastAPI router exposing the modular summarization pipeline endpoints."""

from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from .models import DocumentRecord, IngestResponse, SummaryRequest, SummaryResponse
from .service import clear_documents, ingest_upload, list_documents, query_summary


router = APIRouter(prefix="/pipeline", tags=["Pipeline"])


@router.post("/upload", response_model=IngestResponse)
async def upload_document(file: UploadFile = File(...), mode: str = "universal"):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    payload = await file.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Uploaded file was empty")

    return ingest_upload(file.filename, payload, mode=mode)


@router.post("/summarize", response_model=SummaryResponse)
async def summarize(query: SummaryRequest):
    return query_summary(query)


@router.get("/documents", response_model=list[DocumentRecord])
async def documents():
    return list_documents()


@router.post("/reset")
async def reset_pipeline():
    clear_documents()
    return {"ok": True}


__all__ = ["router"]
