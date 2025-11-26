from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Literal, Optional
import re
import os
import tempfile
from contextlib import asynccontextmanager

# Import existing modules
from obs import install_handlers
from security import security_headers, rate_limit
from ingest import pdf_text
from report import build_report

# Import decision engine
from decision_engine import (
    generate_recommendation,
    calculate_benchmarks,
    extract_key_terms,
    generate_negotiation_templates,
    calculate_cost_scenarios
)

# Import universal analyzer
from analyzer_engine import analyze_content, ContentAnalysis

# Import admin security portal
from admin_security import router as admin_router, log_security_event

# Import Stripe routes
from stripe_routes import create_checkout_session, handle_webhook, CheckoutSessionRequest

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 PaiperSum Enhanced API starting...")
    yield
    print("👋 PaiperSum Enhanced API shutting down...")

app = FastAPI(
    title="PaiperSum AI Analyzer",
    version="3.0.0",
    description="Top-tier AI analyzer and summarizer for any content type",
    lifespan=lifespan
)

# Include admin router
app.include_router(admin_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Install security
install_handlers(app)
app.middleware('http')(rate_limit)
app.middleware('http')(security_headers)

# Enhanced models
class AnalyzeIn(BaseModel):
    text: str
    doc_type: Optional[str] = 'general'

class Clause(BaseModel):
    title: str
    summary: str
    risk: Literal['green', 'yellow', 'red']
    citation: str
    impact: Optional[str] = None

class Recommendation(BaseModel):
    decision: Literal['sign', 'negotiate', 'walk_away']
    confidence: float
    reasoning: str
    action_items: List[str]
    cost_impact: int

class Benchmark(BaseModel):
    metric: str
    your_value: str
    average_value: str
    percentile: int
    is_good: bool

class NegotiationPoint(BaseModel):
    clause_title: str
    current_term: str
    suggested_term: str
    success_rate: float
    email_template: str
    importance: str

class CostScenario(BaseModel):
    name: str
    cost: int
    description: str
    is_best: bool
    warning: Optional[str] = None

class EnhancedAnalysis(BaseModel):
    risk_score: int
    clauses: List[Clause]
    confidence: float
    recommendation: Recommendation
    benchmarks: List[Benchmark]
    negotiation_points: List[NegotiationPoint]
    cost_scenarios: List[CostScenario]
    share_url: Optional[str] = None
    share_image_url: Optional[str] = None

# Analysis rules with impact
RULES = [
    (r"indemnif(y|ication)", "Indemnification", "You must defend and pay for the other party if something goes wrong.", 'red', "Unlimited liability"),
    (r"waive|release|hold harmless", "Release/Waiver", "You give up rights to sue or recover damages.", 'red', "Give up legal rights"),
    (r"arbitration|binding arbitration", "Arbitration", "Disputes must go to arbitration instead of court.", 'yellow', "Can't sue in court"),
    (r"class action", "Class Action Waiver", "You cannot join class actions.", 'yellow', "Must sue alone"),
    (r"auto[- ]?renew|automatically renew", "Auto-Renewal", "The agreement renews unless you cancel.", 'yellow', "May forget to cancel"),
    (r"as is|no warranties|without warranty", "No Warranty", "The provider disclaims responsibility for quality or fitness.", 'yellow', "No guarantees"),
    (r"governing law|venue|jurisdiction", "Governing Law/Venue", "Which court/law applies is predefined.", 'green', "Standard clause"),
    (r"share .* data|third[- ]?part(y|ies) .* data|sell .* data", "Data Sharing", "Your data may be shared or sold to third parties.", 'yellow', "Privacy concern"),
    (r"assume .* risk|at (my|your) sole risk", "Assumption of Risk", "You accept all risks of harm.", 'red', "All liability on you"),
    (r"limit(ing)? liability|limitation of liability", "Liability Limitation", "Provider limits how much they can be sued for.", 'yellow', "Low damages cap"),
    (r"termination|cancel(l)?ation", "Termination Clause", "How and when the agreement can be ended.", 'green', "Exit terms"),
    (r"confidential(ity)?|non[- ]?disclosure", "Confidentiality", "You must keep certain information secret.", 'yellow', "Binding promise"),
]

RISK_WEIGHTS = {'red': 30, 'yellow': 12, 'green': 4}

def _extract_sentence(text: str, idx: int) -> str:
    start = max(0, text.rfind('.', 0, idx) + 1)
    end = text.find('.', idx)
    if end == -1:
        end = min(len(text), idx + 180)
    snippet = text[start:end].strip()
    return snippet[:240]

def detect_document_type(text: str) -> str:
    """Auto-detect document type"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['gym', 'fitness', 'membership', 'exercise']):
        return 'gym_membership'
    elif any(word in text_lower for word in ['lease', 'landlord', 'tenant', 'rent', 'apartment']):
        return 'apartment_lease'
    elif any(word in text_lower for word in ['phone', 'wireless', 'cellular', 'data plan', 'carrier']):
        return 'phone_contract'
    elif any(word in text_lower for word in ['software', 'terms of service', 'tos', 'privacy policy', 'user agreement']):
        return 'software_tos'
    else:
        return 'general'

@app.get('/')
def root():
    return {
        "name": "PaiperSum AI Analyzer",
        "version": "3.0.0",
        "status": "operational",
        "description": "Top-tier AI analyzer and summarizer for any content",
        "features": [
            "Universal content analysis (documents, code, articles, emails, etc.)",
            "AI-powered summarization with key insights",
            "Sentiment analysis and topic extraction",
            "Actionable recommendations",
            "Security monitoring and threat detection",
            "Professional API with comprehensive documentation"
        ],
        "docs": "/docs",
        "admin": "/admin/dashboard"
    }

@app.get('/health')
def health():
    return {"status": "healthy", "version": "3.0.0", "service": "PaiperSum AI Analyzer"}

@app.post('/analyze', response_model=EnhancedAnalysis)
async def analyze(inp: AnalyzeIn, request: Request):
    """Universal AI analysis - handles any content type"""
    text = inp.text or ''
    
    # Security logging
    client_ip = request.client.host if request.client else 'unknown'
    user_agent = request.headers.get('user-agent', 'unknown')
    
    if not text.strip():
        log_security_event(
            event_type='invalid_request',
            severity='low',
            ip_address=client_ip,
            user_agent=user_agent,
            details={'error': 'empty_text'}
        )
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) > 500000:
        log_security_event(
            event_type='oversized_request',
            severity='medium',
            ip_address=client_ip,
            user_agent=user_agent,
            details={'size': len(text)}
        )
        raise HTTPException(status_code=400, detail="Text too long (max 500KB)")
    
    # Universal content analysis
    try:
        content_analysis = analyze_content(text, use_ai=True)
    except Exception as e:
        log_security_event(
            event_type='analysis_error',
            severity='medium',
            ip_address=client_ip,
            user_agent=user_agent,
            details={'error': str(e)}
        )
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    # Auto-detect document type if not provided
    doc_type: str = inp.doc_type if inp.doc_type and inp.doc_type != 'general' else detect_document_type(text)
    
    # Legal document analysis (if applicable)
    found: List[Clause] = []
    total = 0
    seen_titles = set()
    
    for pattern, title, summary, risk, impact in RULES:
        m = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
        if m and title not in seen_titles:
            snippet = _extract_sentence(text, m.start())
            # Type cast risk to literal type
            risk_literal: Literal['green', 'yellow', 'red'] = risk  # type: ignore
            found.append(Clause(
                title=title,
                summary=summary,
                risk=risk_literal,
                citation=snippet,
                impact=impact
            ))
            total += RISK_WEIGHTS[risk]
            seen_titles.add(title)
    
    risk_score = max(0, min(100, total))
    confidence = 0.75 if found else 0.5
    
    # Extract key terms
    terms = extract_key_terms(text, doc_type)
    
    # Generate recommendation
    recommendation = generate_recommendation(risk_score, [c.dict() for c in found], terms, doc_type)
    
    # Calculate benchmarks
    benchmarks = calculate_benchmarks(terms, doc_type)
    benchmark_models = [
        Benchmark(
            metric=key,
            your_value=b.your_value,
            average_value=b.average_value,
            percentile=b.percentile,
            is_good=b.is_good
        ) for key, b in zip(terms.keys(), benchmarks)
    ]
    
    # Generate negotiation points
    negotiation_points = generate_negotiation_templates([c.dict() for c in found], terms, doc_type)
    negotiation_models = [
        NegotiationPoint(
            clause_title=n.clause_title,
            current_term=n.current_term,
            suggested_term=n.suggested_term,
            success_rate=n.success_rate,
            email_template=n.email_template,
            importance=n.importance
        ) for n in negotiation_points
    ]
    
    # Calculate cost scenarios
    scenarios = calculate_cost_scenarios(terms, doc_type)
    scenario_models = [CostScenario(**s) for s in scenarios]
    
    # Generate share URL
    import hashlib
    doc_hash = hashlib.md5(text[:100].encode()).hexdigest()[:8]
    share_url = f"https://paipersum.com/share/{doc_hash}"
    
    # Log successful analysis
    log_security_event(
        event_type='analysis_complete',
        severity='low',
        ip_address=client_ip,
        user_agent=user_agent,
        details={
            'content_type': content_analysis.content_type,
            'word_count': content_analysis.word_count,
            'doc_type': doc_type
        }
    )
    
    return EnhancedAnalysis(
        risk_score=risk_score,
        clauses=found,
        confidence=max(confidence, content_analysis.confidence),
        recommendation=Recommendation(**recommendation.__dict__),
        benchmarks=benchmark_models,
        negotiation_points=negotiation_models,
        cost_scenarios=scenario_models,
        share_url=share_url,
        share_image_url=f"{share_url}/image"
    )

@app.post('/analyze-file', response_model=EnhancedAnalysis)
async def analyze_file(file: UploadFile = File(...), request: Request = Request):
    """Universal file analysis - supports any file type"""
    # Security logging
    client_ip = request.client.host if request.client else 'unknown'
    user_agent = request.headers.get('user-agent', 'unknown')
    
    if not file.filename:
        log_security_event(
            event_type='invalid_file_upload',
            severity='low',
            ip_address=client_ip,
            user_agent=user_agent,
            details={'error': 'no_filename'}
        )
        raise HTTPException(status_code=400, detail="No filename provided")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        log_security_event(
            event_type='oversized_file',
            severity='medium',
            ip_address=client_ip,
            user_agent=user_agent,
            details={'size': len(content), 'filename': file.filename}
        )
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    allowed_extensions = {'.pdf', '.txt', '.doc', '.docx', '.md', '.json', '.csv', '.py', '.js', '.ts', '.html', '.css'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        log_security_event(
            event_type='unsupported_file_type',
            severity='low',
            ip_address=client_ip,
            user_agent=user_agent,
            details={'extension': ext, 'filename': file.filename}
        )
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
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
            text = content.decode('utf-8', errors='ignore')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text: {str(e)}")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from file")
    
    return await analyze(AnalyzeIn(text=text))

@app.post('/export/pdf')
async def export_pdf(inp: AnalyzeIn):
    """Export analysis as PDF report"""
    if not inp.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    analysis = await analyze(inp)
    
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

@app.get('/document-types')
def get_document_types():
    """Get supported document types and their benchmarks"""
    return {
        "types": [
            {"id": "gym_membership", "name": "Gym Membership", "emoji": "💪"},
            {"id": "apartment_lease", "name": "Apartment Lease", "emoji": "🏠"},
            {"id": "phone_contract", "name": "Phone Contract", "emoji": "📱"},
            {"id": "software_tos", "name": "Software Terms of Service", "emoji": "💻"},
            {"id": "general", "name": "General Contract", "emoji": "📄"}
        ]
    }

# Stripe Payment Endpoints
@app.post('/create-checkout-session')
async def create_checkout_session_endpoint(data: CheckoutSessionRequest):
    """Create a Stripe checkout session for Pro subscription"""
    return create_checkout_session(data)

@app.post('/stripe-webhook')
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """Handle Stripe webhooks"""
    payload = await request.body()
    return handle_webhook(payload, stripe_signature)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
