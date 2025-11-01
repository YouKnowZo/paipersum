"""Universal summarization routes"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, Literal
import os
from pathlib import Path

from utils.chunking import chunk_text
from utils.embeddings import add_documents, search, clear_index, get_index_size, get_kb_texts
from utils.storage import save_temp, cleanup
from ingest import text_from_any
from processors.universal_processor import summarize_universal, get_available_styles
from processors.legal_processor import summarize_legal, get_legal_styles

router = APIRouter()

class SummarizeRequest(BaseModel):
    query: Optional[str] = None
    style: str = "concise"
    mode: Literal["universal", "legal"] = "universal"
    document_type: Optional[str] = None

class SummarizeResponse(BaseModel):
    summary: str
    mode: str
    style: str
    sources_count: int = 0
    chunks_processed: int = 0

@router.post("/upload", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    mode: str = Form("universal")
):
    """
    Upload and process a document for summarization
    
    Supports: PDF, DOCX, images (PNG, JPG, etc.), plain text
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Check file size (max 10MB)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Save temporarily
    temp_path = save_temp(file.filename, content)
    
    try:
        # Extract text
        text = text_from_any(temp_path)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract meaningful text from file"
            )
        
        # Chunk text
        chunks = chunk_text(text, max_chars=3000, overlap=200)
        
        # Add to vector store
        add_documents(chunks)
        
        return {
            "status": "ok",
            "chunks_added": len(chunks),
            "text_length": len(text),
            "mode": mode
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    finally:
        cleanup(temp_path)

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(
    request: SummarizeRequest
):
    """
    Summarize uploaded documents
    
    Modes:
    - universal: For any document type (books, recipes, job postings, etc.)
    - legal: For legal documents (contracts, TOS, privacy policies)
    
    Styles vary by mode - see /summarize/styles endpoint
    """
    # Retrieve relevant chunks
    if request.query:
        chunks = search(request.query, k=6)
    else:
        # If no query, use recent chunks (last 6)
        kb_texts = get_kb_texts()
        chunks = kb_texts[-6:] if len(kb_texts) > 6 else kb_texts
    
    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No documents uploaded. Please upload a file first using /upload"
        )
    
    # Generate summary based on mode
    if request.mode == "legal":
        summary = summarize_legal(
            chunks=chunks,
            style=request.style,
            document_type=request.document_type
        )
    else:
        summary = summarize_universal(
            chunks=chunks,
            style=request.style,
            document_type=request.document_type
        )
    
    return SummarizeResponse(
        summary=summary,
        mode=request.mode,
        style=request.style,
        sources_count=len(chunks),
        chunks_processed=len(chunks)
    )

@router.post("/summarize-file", response_model=SummarizeResponse)
async def summarize_file(
    file: UploadFile = File(...),
    mode: str = Form("universal"),
    style: str = Form("concise"),
    query: Optional[str] = Form(None),
    document_type: Optional[str] = Form(None)
):
    """
    Upload and summarize a file in one request
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Check file size
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Save temporarily
    temp_path = save_temp(file.filename, content)
    
    try:
        # Extract text
        text = text_from_any(temp_path)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract meaningful text from file"
            )
        
        # Chunk text
        chunks = chunk_text(text, max_chars=3000, overlap=200)
        
        # Add to vector store
        add_documents(chunks)
        
        # If query provided, search for relevant chunks
        if query:
            relevant_chunks = search(query, k=6)
            if relevant_chunks:
                chunks = relevant_chunks
        
        # Generate summary
        if mode == "legal":
            summary = summarize_legal(
                chunks=chunks,
                style=style,
                document_type=document_type
            )
        else:
            summary = summarize_universal(
                chunks=chunks,
                style=style,
                document_type=document_type
            )
        
        return SummarizeResponse(
            summary=summary,
            mode=mode,
            style=style,
            sources_count=len(chunks),
            chunks_processed=len(chunks)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    finally:
        cleanup(temp_path)

@router.get("/summarize/styles")
async def get_summary_styles(mode: str = "universal"):
    """
    Get available summary styles for a mode
    """
    if mode == "legal":
        return {"mode": mode, "styles": get_legal_styles()}
    else:
        return {"mode": mode, "styles": get_available_styles()}

@router.post("/clear")
async def clear_documents():
    """Clear all uploaded documents from memory"""
    clear_index()
    return {"status": "ok", "message": "All documents cleared"}

@router.get("/status")
async def get_status():
    """Get current status of the summarization system"""
    return {
        "status": "ok",
        "documents_indexed": get_index_size(),
        "modes": ["universal", "legal"]
    }
