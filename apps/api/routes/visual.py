"""Visual document viewer with risk highlighting"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import re

router = APIRouter()

class Highlight(BaseModel):
    text: str
    start: int
    end: int
    risk: str  # 'red', 'yellow', 'green'
    clause_type: str
    explanation: str

class DocumentViewer(BaseModel):
    text: str
    highlights: List[Highlight]

# Risk patterns for highlighting
RISK_PATTERNS = [
    (r"indemnif(y|ication)", "Indemnification", "red"),
    (r"waive|release|hold harmless", "Release/Waiver", "red"),
    (r"arbitration|binding arbitration", "Arbitration", "yellow"),
    (r"class action", "Class Action Waiver", "yellow"),
    (r"auto[- ]?renew|automatically renew", "Auto-Renewal", "yellow"),
    (r"as is|no warranties|without warranty", "No Warranty", "yellow"),
    (r"share .* data|third[- ]?part(y|ies) .* data", "Data Sharing", "yellow"),
    (r"assume .* risk|at (my|your) sole risk", "Assumption of Risk", "red"),
    (r"limit(ing)? liability|limitation of liability", "Liability Limitation", "yellow"),
]

@router.post("/highlight", response_model=DocumentViewer)
async def highlight_document(text: str):
    """
    Highlight risks and important clauses in document text
    
    Unique feature: Visual highlighting in original document
    """
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    highlights = []
    seen_positions = set()
    
    for pattern, clause_type, risk in RISK_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            start = match.start()
            end = match.end()
            
            # Avoid duplicate highlights
            if (start, end) in seen_positions:
                continue
            seen_positions.add((start, end))
            
            # Extract surrounding context
            context_start = max(0, start - 50)
            context_end = min(len(text), end + 50)
            snippet = text[context_start:context_end]
            
            # Get explanation based on clause type
            explanations = {
                "Indemnification": "You must defend and pay for the other party if something goes wrong.",
                "Release/Waiver": "You give up rights to sue or recover damages.",
                "Arbitration": "Disputes must go to arbitration instead of court.",
                "Class Action Waiver": "You cannot join class actions.",
                "Auto-Renewal": "The agreement renews unless you cancel.",
                "No Warranty": "The provider disclaims responsibility for quality.",
                "Data Sharing": "Your data may be shared or sold to third parties.",
                "Assumption of Risk": "You accept all risks of harm.",
                "Liability Limitation": "Provider limits how much they can be sued for.",
            }
            
            highlights.append(Highlight(
                text=snippet,
                start=start,
                end=end,
                risk=risk,
                clause_type=clause_type,
                explanation=explanations.get(clause_type, "Important clause")
            ))
    
    # Sort by position
    highlights.sort(key=lambda x: x.start)
    
    return DocumentViewer(
        text=text,
        highlights=highlights[:50]  # Limit to 50 highlights
    )
