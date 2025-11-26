from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Literal, Optional
from collections import Counter
import re
import os
import tempfile
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from state import (
    record_analysis,
    get_analyses,
    get_config,
    update_config,
    get_billing,
    get_customers,
    get_threat_events,
    upsert_threat_events
)

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

# Import Stripe routes
from stripe_routes import create_checkout_session, handle_webhook, CheckoutSessionRequest

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 PaiperSum Enhanced API starting...")
    yield
    print("👋 PaiperSum Enhanced API shutting down...")

app = FastAPI(
    title="PaiperSum Enhanced API",
    version="2.0.0",
    description="Useful document analysis with actionable recommendations",
    lifespan=lifespan
)

ADMIN_API_KEY = os.getenv('ADMIN_API_KEY')

def require_admin(x_admin_key: str = Header(None)):
    if not ADMIN_API_KEY:
        raise HTTPException(status_code=500, detail="Admin API key not configured")
    if x_admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")
    return True

allowed_origins = [origin.strip() for origin in os.getenv('ALLOWED_ORIGINS', '*').split(',') if origin.strip()]
if not allowed_origins:
    allowed_origins = ['*']

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

class ThreatEvent(BaseModel):
    id: str
    timestamp: str
    severity: Literal['low', 'medium', 'high', 'critical']
    status: Literal['blocked', 'mitigated', 'investigating']
    vector: str
    source_ip: str
    location: str
    isp: str
    attempts: int
    notes: str

class ThreatStat(BaseModel):
    label: str
    value: str
    change: float
    is_positive: bool

class IntegrationStatus(BaseModel):
    name: str
    status: Literal['ok', 'warning', 'error']
    detail: str

class ThreatDashboard(BaseModel):
    stats: List[ThreatStat]
    events: List[ThreatEvent]
    watchlist: List[str]
    recommendations: List[str]
    integrations: List[IntegrationStatus]
    last_updated: str

class RiskBreakdown(BaseModel):
    level: Literal['low', 'medium', 'high']
    percent: float

class UsageKPI(BaseModel):
    label: str
    value: str
    trend: float
    detail: str

class UsageSummary(BaseModel):
    total_documents: int
    documents_today: int
    average_risk: float
    top_doc_types: List[str]
    risk_breakdown: List[RiskBreakdown]
    kpis: List[UsageKPI]

class Invoice(BaseModel):
    id: str
    amount: int
    status: Literal['paid', 'due', 'past_due']
    due_date: str

class BillingSnapshot(BaseModel):
    plan: str
    plan_price: int
    currency: str
    seats_included: int
    seats_used: int
    mrr: int
    renews_on: str
    invoices: List[Invoice]

class HealthCheck(BaseModel):
    name: str
    status: Literal['ok', 'warning', 'critical']
    detail: str

class SystemHealth(BaseModel):
    uptime: str
    incidents_open: int
    avg_latency_ms: int
    queue_depth: int
    checks: List[HealthCheck]

class ConfigSettings(BaseModel):
    rate_limit_window: int
    rate_limit_limit: int
    maintenance_mode: bool
    allowed_admin_ips: List[str]

class ConfigUpdate(BaseModel):
    rate_limit_window: Optional[int] = None
    rate_limit_limit: Optional[int] = None
    maintenance_mode: Optional[bool] = None
    allowed_admin_ips: Optional[List[str]] = None

class AdminDashboard(BaseModel):
    stats: List[ThreatStat]
    events: List[ThreatEvent]
    watchlist: List[str]
    recommendations: List[str]
    integrations: List[IntegrationStatus]
    last_updated: str
    usage: UsageSummary
    billing: BillingSnapshot
    system_health: SystemHealth
    config: ConfigSettings

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

def _iso(dt: datetime) -> str:
    return dt.replace(microsecond=0).isoformat().replace("+00:00", "Z")

def _parse_iso(ts: str) -> datetime:
    if ts.endswith('Z'):
        ts = ts.replace('Z', '+00:00')
    return datetime.fromisoformat(ts)

def _seed_threat_events() -> List[dict]:
    """Populate stored threat events for the admin portal."""
    existing = get_threat_events()
    if existing:
        return existing

    now = datetime.now(timezone.utc)
    base = [
        {
            "id": "ps-992",
            "severity": "high",
            "status": "blocked",
            "vector": "credential_stuffing",
            "source_ip": "223.72.88.14",
            "location": "Shenzhen, CN",
            "isp": "China Telecom",
            "attempts": 11248,
            "notes": "Botnet replayed leaked admin emails against /auth/login"
        },
        {
            "id": "ps-877",
            "severity": "critical",
            "status": "investigating",
            "vector": "api_exfiltration_probe",
            "source_ip": "35.176.12.44",
            "location": "London, UK",
            "isp": "AWS EC2",
            "attempts": 642,
            "notes": "GraphQL introspection attempts with mutation fuzzing"
        },
        {
            "id": "ps-741",
            "severity": "medium",
            "status": "blocked",
            "vector": "privacy_policy_scrape",
            "source_ip": "104.238.211.90",
            "location": "Dallas, US",
            "isp": "Vultr",
            "attempts": 188,
            "notes": "High-volume scraping of /privacy.html and /terms.html"
        },
        {
            "id": "ps-615",
            "severity": "high",
            "status": "mitigated",
            "vector": "s3_signed_url_guessing",
            "source_ip": "91.210.145.12",
            "location": "Warsaw, PL",
            "isp": "OVH",
            "attempts": 94,
            "notes": "Enumerated report download endpoints, blocked via signed URLs"
        },
        {
            "id": "ps-502",
            "severity": "low",
            "status": "blocked",
            "vector": "extension_injection",
            "source_ip": "45.9.20.6",
            "location": "Amsterdam, NL",
            "isp": "M247",
            "attempts": 41,
            "notes": "Injected scripts into Chrome extension context; CSP prevented execution"
        }
    ]
    
    for idx, event in enumerate(base):
        event_copy = event.copy()
        event_copy["timestamp"] = _iso(now - timedelta(minutes=idx * 11))
        existing.append(event_copy)

    upsert_threat_events(existing)
    return existing

def _get_threat_event(event_id: str) -> Optional[dict]:
    events = get_threat_events()
    return next((event for event in events if event["id"] == event_id), None)

def _ensure_service_available():
    config = get_config()
    if config.get('maintenance_mode'):
        raise HTTPException(status_code=503, detail="Service temporarily unavailable (maintenance)")

def build_admin_dashboard() -> AdminDashboard:
    events = _seed_threat_events()
    analyses = get_analyses()
    billing = get_billing()
    config = get_config()
    
    blocked_attempts = sum(event["attempts"] for event in events if event["status"] == "blocked")
    
    stats = [
        ThreatStat(label="Blocked requests (24h)", value=f"{blocked_attempts:,}", change=12.4, is_positive=True),
        ThreatStat(label="Credential stuffing attempts", value="11,248", change=-4.1, is_positive=True),
        ThreatStat(label="Incident-free days", value="218", change=1.0, is_positive=True),
        ThreatStat(label="Patch window", value="Next window in 6h", change=0.0, is_positive=True)
    ]
    
    watchlist = [
        "CVE-2024-7583 (OpenSSL DTLS) — patch scheduled",
        "Okta session token replay — monitor expired tokens",
        "Chrome extension supply chain — review upcoming publish"
    ]
    
    recommendations = [
        "Rotate API keys older than 90 days (12 keys flagged)",
        "Expand WAF rule PS-992 to include /account/exports",
        "Ship weekly trust digest to enterprise customers"
    ]
    
    integrations = [
        IntegrationStatus(name="Slack", status="ok", detail="Sending hourly digests to #trust-and-safety"),
        IntegrationStatus(name="Teams", status="warning", detail="Connector token expires in 3 days"),
        IntegrationStatus(name="PagerDuty", status="ok", detail="Mapped to Critical-Atlas service"),
        IntegrationStatus(name="Notion", status="ok", detail="Playbooks synced to Trust Hub space")
    ]
    
    total_docs = len(analyses)
    today = datetime.now(timezone.utc).date()
    documents_today = sum(1 for entry in analyses if "timestamp" in entry and _parse_iso(entry["timestamp"]).date() == today)
    avg_risk = round(sum(entry.get('risk_score', 0) for entry in analyses) / total_docs, 2) if total_docs else 0.0
    
    doc_type_counts = Counter(entry.get('doc_type', 'general') for entry in analyses)
    top_doc_types = [doc for doc, _ in doc_type_counts.most_common(3)]
    
    risk_buckets = {'low': 0, 'medium': 0, 'high': 0}
    for entry in analyses:
        score = entry.get('risk_score', 0)
        if score >= 70:
            risk_buckets['high'] += 1
        elif score >= 40:
            risk_buckets['medium'] += 1
        else:
            risk_buckets['low'] += 1
    risk_breakdown = [
        RiskBreakdown(level=level, percent=round((count / total_docs) * 100, 1) if total_docs else 0.0)
        for level, count in risk_buckets.items()
    ]
    
    negotiation_total = sum(1 for entry in analyses if entry.get('decision') in {'negotiate', 'walk_away'})
    cost_protected = sum(max(0, entry.get('cost_impact', 0)) for entry in analyses)
    
    kpis = [
        UsageKPI(label="Negotiations triggered", value=str(negotiation_total), trend=3.2, detail="Docs flagged negotiate/walk"),
        UsageKPI(label="Cost protected", value=f"${cost_protected:,.0f}", trend=5.1, detail="Projected exposure avoided"),
        UsageKPI(label="Docs analyzed (7d)", value=str(min(total_docs, 120)), trend=1.4, detail="Completed this week")
    ]
    
    usage = UsageSummary(
        total_documents=total_docs,
        documents_today=documents_today,
        average_risk=avg_risk,
        top_doc_types=top_doc_types,
        risk_breakdown=risk_breakdown,
        kpis=kpis
    )
    
    invoices = [
        Invoice(id="INV-2025-005", amount=billing['plan_price'] * billing['seats_used'], status='paid', due_date=billing['renews_on']),
        Invoice(id="INV-2025-004", amount=billing['plan_price'] * billing['seats_used'], status='paid', due_date="2025-11-01"),
        Invoice(id="INV-2025-003", amount=billing['plan_price'] * billing['seats_used'], status='paid', due_date="2025-10-01")
    ]
    
    billing_snapshot = BillingSnapshot(
        plan=billing['plan'],
        plan_price=billing['plan_price'],
        currency=billing['currency'],
        seats_included=billing['seats_included'],
        seats_used=billing['seats_used'],
        mrr=billing['mrr'],
        renews_on=billing['renews_on'],
        invoices=invoices
    )
    
    system_health = SystemHealth(
        uptime="99.985%",
        incidents_open=1,
        avg_latency_ms=182,
        queue_depth=3,
        checks=[
            HealthCheck(name="API", status="ok", detail="All pods responding"),
            HealthCheck(name="Workers", status="ok", detail="3 consumers active"),
            HealthCheck(name="Browser extension", status="warning", detail="Chrome review pending"),
            HealthCheck(name="Webhook delivery", status="ok", detail="p95 320ms")
        ]
    )
    
    config_settings = ConfigSettings(
        rate_limit_window=int(config.get('rate_limit_window', 10)),
        rate_limit_limit=int(config.get('rate_limit_limit', 30)),
        maintenance_mode=bool(config.get('maintenance_mode', False)),
        allowed_admin_ips=list(config.get('allowed_admin_ips', []))
    )
    
    return AdminDashboard(
        stats=stats,
        events=[ThreatEvent(**event) for event in events],
        watchlist=watchlist,
        recommendations=recommendations,
        integrations=integrations,
        last_updated=_iso(datetime.now(timezone.utc)),
        usage=usage,
        billing=billing_snapshot,
        system_health=system_health,
        config=config_settings
    )

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
        "name": "PaiperSum Enhanced API",
        "version": "2.0.0",
        "status": "operational",
        "new_features": [
            "Clear recommendations (Sign/Negotiate/Walk Away)",
            "Benchmarking vs similar contracts",
            "Negotiation email templates",
            "Cost scenario calculator",
            "Document type detection"
        ],
        "docs": "/docs"
    }

@app.get('/health')
def health():
    return {"status": "healthy", "version": "2.0.0"}

@app.post('/analyze', response_model=EnhancedAnalysis)
async def analyze(inp: AnalyzeIn):
    """Enhanced analysis with actionable recommendations"""
    text = inp.text or ''
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) > 500000:
        raise HTTPException(status_code=400, detail="Text too long (max 500KB)")

    _ensure_service_available()
    
    # Auto-detect document type if not provided
    doc_type: str = inp.doc_type if inp.doc_type and inp.doc_type != 'general' else detect_document_type(text)
    
    # Original analysis
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
    
    analysis_payload = EnhancedAnalysis(
        risk_score=risk_score,
        clauses=found,
        confidence=confidence,
        recommendation=Recommendation(**recommendation.__dict__),
        benchmarks=benchmark_models,
        negotiation_points=negotiation_models,
        cost_scenarios=scenario_models,
        share_url=share_url,
        share_image_url=f"{share_url}/image"
    )

    record_analysis({
        "id": doc_hash,
        "timestamp": _iso(datetime.now(timezone.utc)),
        "doc_type": doc_type,
        "risk_score": risk_score,
        "decision": recommendation.decision,
        "cost_impact": recommendation.cost_impact
    })
    
    return analysis_payload

@app.post('/analyze-file', response_model=EnhancedAnalysis)
async def analyze_file(file: UploadFile = File(...)):
    """Enhanced file analysis"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    _ensure_service_available()
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    allowed_extensions = {'.pdf', '.txt', '.doc', '.docx'}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
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
    
    _ensure_service_available()
    
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

@app.get('/admin/dashboard', response_model=AdminDashboard, dependencies=[Depends(require_admin)])
def admin_dashboard():
    """Return business + security telemetry for the admin portal."""
    return build_admin_dashboard()

@app.post('/threats/{event_id}/acknowledge', response_model=ThreatEvent, dependencies=[Depends(require_admin)])
def acknowledge_threat(event_id: str):
    """Mark a threat event as mitigated/acknowledged."""
    _seed_threat_events()
    event = _get_threat_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Threat event not found")
    
    event["status"] = "mitigated"
    if "acknowledged" not in event["notes"]:
        event["notes"] = f'{event["notes"]} | acknowledged via admin portal'
    
    events = get_threat_events()
    for idx, entry in enumerate(events):
        if entry["id"] == event_id:
            events[idx] = event
            break
    upsert_threat_events(events)
    
    return ThreatEvent(**event)

@app.patch('/admin/config', response_model=ConfigSettings, dependencies=[Depends(require_admin)])
def update_admin_config(payload: ConfigUpdate):
    """Update runtime limits and maintenance toggles."""
    updates = {k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None}
    if not updates:
        return ConfigSettings(**get_config())
    
    config = update_config(updates)
    return ConfigSettings(
        rate_limit_window=int(config.get('rate_limit_window', 10)),
        rate_limit_limit=int(config.get('rate_limit_limit', 30)),
        maintenance_mode=bool(config.get('maintenance_mode', False)),
        allowed_admin_ips=list(config.get('allowed_admin_ips', []))
    )

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
