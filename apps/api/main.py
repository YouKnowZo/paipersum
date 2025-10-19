from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal
import re
import tempfile
import os

app = FastAPI(title="PaiperSum API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for auth and billing (optional, comment out if deps missing)
try:
    from auth import router as auth_router
    from billing import router as billing_router
    app.include_router(auth_router)
    app.include_router(billing_router)
except ImportError:
    pass  # Auth/billing modules not available yet

class AnalyzeIn(BaseModel):
    text: str

class Clause(BaseModel):
    title: str
    summary: str
    risk: Literal['green','yellow','red']
    citation: str

class AnalyzeOut(BaseModel):
    risk_score: int
    clauses: List[Clause]
    confidence: float

RULES = [
    (r"indemnif(y|ication)", "Indemnification", "You must defend and pay for the other party if something goes wrong.", 'red'),
    (r"waive|release|hold harmless", "Release/Waiver", "You give up rights to sue or recover damages.", 'red'),
    (r"arbitration|binding arbitration", "Arbitration", "Disputes must go to arbitration instead of court.", 'yellow'),
    (r"class action", "Class Action Waiver", "You cannot join class actions.", 'yellow'),
    (r"auto[- ]?renew|automatically renew", "Auto‑Renewal", "The agreement renews unless you cancel.", 'yellow'),
    (r"as is|no warranties|without warranty", "No Warranty", "The provider disclaims responsibility for quality or fitness.", 'yellow'),
    (r"governing law|venue|jurisdiction", "Governing Law/Venue", "Which court/law applies is predefined.", 'green'),
    (r"share .* data|third[- ]?part(y|ies) .* data|sell .* data", "Data Sharing", "Your data may be shared or sold to third parties.", 'yellow'),
    (r"assume .* risk|at (my|your) sole risk", "Assumption of Risk", "You accept all risks of harm.", 'red'),
]

RISK_WEIGHTS = {'red': 30, 'yellow': 12, 'green': 4}

@app.post('/analyze', response_model=AnalyzeOut)
def analyze(inp: AnalyzeIn):
    text = inp.text or ''
    found: List[Clause] = []
    total = 0
    for pattern, title, summary, risk in RULES:
        m = re.search(pattern, text, flags=re.IGNORECASE|re.DOTALL)
        if m:
            snippet = _extract_sentence(text, m.start())
            found.append(Clause(title=title, summary=summary, risk=risk, citation=snippet))
            total += RISK_WEIGHTS[risk]
    # normalize crude score 0..100
    score = max(0, min(100, total))
    confidence = 0.75 if found else 0.5
    return AnalyzeOut(risk_score=score, clauses=found, confidence=confidence)


def _extract_sentence(text: str, idx: int) -> str:
    # naive sentence grab around index
    start = max(0, text.rfind('.', 0, idx) + 1)
    end = text.find('.', idx)
    if end == -1:
        end = min(len(text), idx + 180)
    snippet = text[start:end].strip()
    return snippet[:240]


@app.post('/analyze-file', response_model=AnalyzeOut)
async def analyze_file(file: UploadFile = File(...)):
    """Analyze uploaded file (PDF or text) using ML model if available, fallback to regex"""
    content = await file.read()
    
    # Save to temp file for processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename or '')[1]) as tmp:
        tmp.write(content)
        path = tmp.name
    
    try:
        # Extract text from PDF if needed
        if file.filename and file.filename.lower().endswith('.pdf'):
            try:
                from ingest import pdf_text
                text = pdf_text(path)
            except ImportError:
                # Fallback: treat as binary
                text = content.decode(errors='ignore')
        else:
            text = content.decode(errors='ignore')
        
        # Try ML model first, fallback to regex
        try:
            from model import classify_clauses
            preds = classify_clauses(text)
            
            # Convert model predictions to response format
            clauses = []
            total_risk = 0
            high_risk_titles = ('Indemnification', 'Release/Waiver', 'Assumption of Risk')
            
            for p in preds:
                risk_level = 'red' if p['title'] in high_risk_titles else 'yellow'
                clauses.append(Clause(
                    title=p['title'],
                    summary=p['title'],  # Could enhance with better summaries
                    risk=risk_level,
                    citation=p['snippet']
                ))
                total_risk += 30 if risk_level == 'red' else 12
            
            risk_score = min(100, total_risk)
            confidence = 0.8
            
        except ImportError:
            # Fallback to regex-based analysis
            found: List[Clause] = []
            total = 0
            for pattern, title, summary, risk in RULES:
                m = re.search(pattern, text, flags=re.IGNORECASE|re.DOTALL)
                if m:
                    snippet = _extract_sentence(text, m.start())
                    found.append(Clause(title=title, summary=summary, risk=risk, citation=snippet))
                    total += RISK_WEIGHTS[risk]
            
            risk_score = max(0, min(100, total))
            confidence = 0.75 if found else 0.5
            clauses = found
        
        return AnalyzeOut(risk_score=risk_score, clauses=clauses, confidence=confidence)
    
    finally:
        # Cleanup temp file
        if os.path.exists(path):
            os.unlink(path)
