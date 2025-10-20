from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Literal
import re
import os
import tempfile
from contextlib import asynccontextmanager

# Import modules
from obs import install_handlers
from security import security_headers, rate_limit
from ingest import pdf_text
from report import build_report

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 PaiperSum API starting...")
    yield
    # Shutdown
    print("👋 PaiperSum API shutting down...")

app = FastAPI(
    title="PaiperSum API",
    version="0.1.0",
    description="Legal document simplification and risk analysis API",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Install security and monitoring
install_handlers(app)
app.middleware('http')(rate_limit)
app.middleware('http')(security_headers)

# Models
class AnalyzeIn(BaseModel):
    text: str

class Clause(BaseModel):
    title: str
    summary: str
    risk: Literal['green', 'yellow', 'red']
    citation: str

class AnalyzeOut(BaseModel):
    risk_score: int
    clauses: List[Clause]
    confidence: float

# Analysis rules
RULES = [
    (r"indemnif(y|ication)", "Indemnification", "You must defend and pay for the other party if something goes wrong.", 'red'),
    (r"waive|release|hold harmless", "Release/Waiver", "You give up rights to sue or recover damages.", 'red'),
    (r"arbitration|binding arbitration", "Arbitration", "Disputes must go to arbitration instead of court.", 'yellow'),
    (r"class action", "Class Action Waiver", "You cannot join class actions.", 'yellow'),
    (r"auto[- ]?renew|automatically renew", "Auto-Renewal", "The agreement renews unless you cancel.", 'yellow'),
    (r"as is|no warranties|without warranty", "No Warranty", "The provider disclaims responsibility for quality or fitness.", 'yellow'),
    (r"governing law|venue|jurisdiction", "Governing Law/Venue", "Which court/law applies is predefined.", 'green'),
    (r"share .* data|third[- ]?part(y|ies) .* data|sell .* data", "Data Sharing", "Your data may be shared or sold to third parties.", 'yellow'),
    (r"assume .* risk|at (my|your) sole risk", "Assumption of Risk", "You accept all risks of harm.", 'red'),
    (r"limit(ing)? liability|limitation of liability", "Liability Limitation", "Provider limits how much they can be sued for.", 'yellow'),
    (r"termination|cancel(l)?ation", "Termination Clause", "How and when the agreement can be ended.", 'green'),
    (r"confidential(ity)?|non[- ]?disclosure", "Confidentiality", "You must keep certain information secret.", 'yellow'),
    (r"intellectual property|IP rights", "IP Rights", "Who owns the intellectual property rights.", 'yellow'),
    (r"force majeure", "Force Majeure", "Exceptions for unforeseeable circumstances.", 'green'),
]

RISK_WEIGHTS = {'red': 30, 'yellow': 12, 'green': 4}

def _extract_sentence(text: str, idx: int) -> str:
    """Extract sentence around index for citation"""
    start = max(0, text.rfind('.', 0, idx) + 1)
    end = text.find('.', idx)
    if end == -1:
        end = min(len(text), idx + 180)
    snippet = text[start:end].strip()
    return snippet[:240]

@app.get('/')
def root():
    return {
        "name": "PaiperSum API",
        "version": "0.1.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get('/health')
def health():
    return {"status": "healthy"}

@app.post('/analyze', response_model=AnalyzeOut)
async def analyze(inp: AnalyzeIn):
    """Analyze legal document text for risks and clauses"""
    text = inp.text or ''
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) > 500000:  # 500KB limit
        raise HTTPException(status_code=400, detail="Text too long (max 500KB)")
    
    found: List[Clause] = []
    total = 0
    seen_titles = set()
    
    for pattern, title, summary, risk in RULES:
        m = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
        if m and title not in seen_titles:
            snippet = _extract_sentence(text, m.start())
            found.append(Clause(
                title=title,
                summary=summary,
                risk=risk,
                citation=snippet
            ))
            total += RISK_WEIGHTS[risk]
            seen_titles.add(title)
    
    # Normalize score 0-100
    score = max(0, min(100, total))
    confidence = 0.75 if found else 0.5
    
    return AnalyzeOut(
        risk_score=score,
        clauses=found,
        confidence=confidence
    )

@app.post('/analyze-file', response_model=AnalyzeOut)
async def analyze_file(file: UploadFile = File(...)):
    """Analyze uploaded document file"""
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    # Check file size (10MB limit)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Check file type
    allowed_extensions = {'.pdf', '.txt', '.doc', '.docx'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Extract text
    try:
        if ext == '.pdf':
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                tmp.write(content)
                tmp_path = tmp.name
            
            try:
                text = pdf_text(tmp_path)
            finally:
                os.unlink(tmp_path)
        else:
            # Assume text file
            text = content.decode('utf-8', errors='ignore')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text: {str(e)}")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from file")
    
    # Analyze extracted text
    return await analyze(AnalyzeIn(text=text))

@app.post('/export/pdf')
async def export_pdf(inp: AnalyzeIn):
    """Export analysis as PDF report"""
    if not inp.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Analyze first
    analysis = await analyze(inp)
    
    # Generate PDF
    try:
        pdf_bytes = build_report('Document Analysis', analysis.dict())
        
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type='application/pdf',
            headers={
                'Content-Disposition': 'attachment; filename="paipersum-report.pdf"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
