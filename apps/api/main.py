from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal
import re

app = FastAPI(title="PaiperSum API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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