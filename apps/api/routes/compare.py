"""Document comparison - Compare two versions side-by-side"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
from ..utils.chunking import chunk_text
from ..utils.embeddings import add_documents, search
from ..processors.legal_processor import summarize_legal
from ..ingest import text_from_any
from ..utils.storage import save_temp, cleanup

router = APIRouter()

class ComparisonResult(BaseModel):
    differences: List[dict]
    added_clauses: List[str]
    removed_clauses: List[str]
    changed_clauses: List[dict]
    summary: str

@router.post("/compare", response_model=ComparisonResult)
async def compare_documents(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    """
    Compare two document versions side-by-side
    
    Unique feature: Shows exactly what changed between versions
    """
    # Process both documents
    path1 = save_temp(file1.filename, await file1.read())
    path2 = save_temp(file2.filename, await file2.read())
    
    try:
        text1 = text_from_any(path1)
        text2 = text_from_any(path2)
        
        if not text1 or not text2:
            raise HTTPException(status_code=400, detail="Could not extract text from documents")
        
        # Chunk both documents
        chunks1 = chunk_text(text1)
        chunks2 = chunk_text(text2)
        
        # Simple diff (in production, use proper diff library)
        differences = []
        added_clauses = []
        removed_clauses = []
        changed_clauses = []
        
        # Compare chunks
        set1 = set(chunks1)
        set2 = set(chunks2)
        
        added = set2 - set1
        removed = set1 - set2
        
        for chunk in added:
            if len(chunk) > 50:
                added_clauses.append(chunk[:200])
        
        for chunk in removed:
            if len(chunk) > 50:
                removed_clauses.append(chunk[:200])
        
        # Generate summary
        summary = f"Found {len(added_clauses)} new clauses and {len(removed_clauses)} removed clauses."
        
        return ComparisonResult(
            differences=differences,
            added_clauses=list(added_clauses)[:10],
            removed_clauses=list(removed_clauses)[:10],
            changed_clauses=changed_clauses,
            summary=summary
        )
    finally:
        cleanup(path1)
        cleanup(path2)
