from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Literal, Optional
import re
import os
import logging
import json
import uuid
from datetime import datetime, timedelta
import asyncio

# Import our modules
from auth import router as auth_router, get_current_user
from database import get_db, init_db
from storage import get_storage_client
from analysis import analyze_text, analyze_file_content
from models import User, Document, Analysis as AnalysisModel
from security import security_headers, rate_limit
from telemetry import init_telemetry

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="PaiperSum API",
    description="AI-powered legal document analysis and risk assessment",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize telemetry
init_telemetry(app)

# Add security middleware
app.middleware("http")(security_headers)
app.middleware("http")(rate_limit)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure properly for production
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# Pydantic models
class AnalyzeRequest(BaseModel):
    text: str

class Clause(BaseModel):
    title: str
    summary: str
    risk: Literal['green', 'yellow', 'red']
    citation: str

class AnalysisResponse(BaseModel):
    risk_score: int
    clauses: List[Clause]
    confidence: float

class DocumentResponse(BaseModel):
    id: str
    name: str
    size: int
    mime_type: str
    created_at: str
    analysis: Optional[AnalysisResponse] = None

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Analysis endpoints
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_document(request: AnalyzeRequest, current_user: User = Depends(get_current_user)):
    """Analyze legal document text for risk assessment"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) > 100000:  # 100KB limit
            raise HTTPException(status_code=400, detail="Text too long (max 100KB)")
        
        result = await analyze_text(request.text)
        return AnalysisResponse(**result)
    
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.post("/analyze-file", response_model=AnalysisResponse)
async def analyze_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Analyze uploaded legal document file"""
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check file size (10MB limit)
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        # Check file type
        allowed_types = ['.pdf', '.doc', '.docx', '.txt']
        file_ext = os.path.splitext(file.filename.lower())[1]
        if file_ext not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type not supported. Allowed: {', '.join(allowed_types)}"
            )
        
        # Analyze file content
        result = await analyze_file_content(content, file.filename, file.content_type)
        return AnalysisResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="File analysis failed")

# Document management endpoints
@app.get("/documents", response_model=List[DocumentResponse])
async def get_documents(current_user: User = Depends(get_current_user)):
    """Get user's documents"""
    try:
        db = next(get_db())
        documents = db.query(Document).filter(Document.user_id == current_user.id).all()
        
        result = []
        for doc in documents:
            analysis = None
            if doc.analysis:
                analysis = AnalysisResponse(**doc.analysis)
            
            result.append(DocumentResponse(
                id=str(doc.id),
                name=doc.name,
                size=doc.size,
                mime_type=doc.mime_type,
                created_at=doc.created_at.isoformat(),
                analysis=analysis
            ))
        
        return result
    
    except Exception as e:
        logger.error(f"Get documents error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve documents")

@app.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, current_user: User = Depends(get_current_user)):
    """Get specific document"""
    try:
        db = next(get_db())
        document = db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        ).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        analysis = None
        if document.analysis:
            analysis = AnalysisResponse(**document.analysis)
        
        return DocumentResponse(
            id=str(document.id),
            name=document.name,
            size=document.size,
            mime_type=document.mime_type,
            created_at=document.created_at.isoformat(),
            analysis=analysis
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get document error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve document")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str, current_user: User = Depends(get_current_user)):
    """Delete document"""
    try:
        db = next(get_db())
        document = db.query(Document).filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        ).first()
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete from storage if exists
        if document.s3_key:
            storage = get_storage_client()
            try:
                storage.remove_object("paipersum", document.s3_key)
            except Exception as e:
                logger.warning(f"Failed to delete file from storage: {e}")
        
        # Delete from database
        db.delete(document)
        db.commit()
        
        return {"message": "Document deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete document error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete document")

# Export endpoints
@app.post("/export/pdf")
async def export_pdf(request: AnalysisResponse, current_user: User = Depends(get_current_user)):
    """Export analysis as PDF"""
    try:
        from report import generate_pdf_report
        
        pdf_content = generate_pdf_report(request.dict())
        
        return StreamingResponse(
            iter([pdf_content]),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=paipersum-report.pdf"}
        )
    
    except Exception as e:
        logger.error(f"PDF export error: {str(e)}")
        raise HTTPException(status_code=500, detail="PDF export failed")

# User info endpoint
@app.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat()
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and other services on startup"""
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("ENVIRONMENT") == "development"
    )