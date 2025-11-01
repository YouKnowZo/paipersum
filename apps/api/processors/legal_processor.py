"""Legal processor for contracts, TOS, privacy policies, etc."""
from typing import List, Optional
from .base_processor import summarize_chunks
import re

LEGAL_NOTE = (
    "Extract key clauses (parties, term, payment, IP, termination, liability, arbitration, governing law). "
    "Flag potential risks (broad indemnity, unilateral changes, data sharing). "
    "Output: bullets → [Clause]: point. End with a short 'Risks' list."
)

LEGAL_STYLE_NOTES = {
    "concise": "Provide a concise summary focusing on key legal terms, obligations, and risks.",
    "bulleted": "Provide a bulleted summary with key clauses, terms, and legal obligations.",
    "risk-focused": "Focus on identifying risks, red flags, and concerning clauses. Highlight what could go wrong.",
    "extract-key-clauses": "Extract and summarize key legal clauses: indemnification, liability, termination, payment, IP, arbitration, governing law.",
    "tos-simplified": "Simplify Terms of Service into plain English. Explain what users are agreeing to.",
    "privacy-summary": "Summarize privacy policy: what data is collected, how it's used, who it's shared with, user rights.",
    "contract-analysis": "Analyze contract: parties, obligations, payment terms, duration, termination, key dates.",
}

def detect_legal_risks(text: str) -> List[dict]:
    """Detect common legal risk patterns"""
    risks = []
    
    risk_patterns = [
        (r"indemnif(y|ication)", "Indemnification", "red"),
        (r"waive|release|hold harmless", "Release/Waiver", "red"),
        (r"arbitration|binding arbitration", "Arbitration", "yellow"),
        (r"class action", "Class Action Waiver", "yellow"),
        (r"auto[- ]?renew|automatically renew", "Auto-Renewal", "yellow"),
        (r"as is|no warranties|without warranty", "No Warranty", "yellow"),
        (r"share .* data|third[- ]?part(y|ies) .* data|sell .* data", "Data Sharing", "yellow"),
        (r"assume .* risk|at (my|your) sole risk", "Assumption of Risk", "red"),
        (r"limit(ing)? liability|limitation of liability", "Liability Limitation", "yellow"),
    ]
    
    for pattern, title, level in risk_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            risks.append({
                "title": title,
                "level": level,
                "pattern": pattern
            })
    
    return risks

def summarize_legal(
    chunks: List[str],
    style: str = "bulleted",
    document_type: Optional[str] = None
) -> str:
    """
    Summarize legal documents with clause extraction and risk analysis
    
    Args:
        chunks: List of text chunks to summarize
        style: Summary style for legal documents
        document_type: Optional document type hint
    
    Returns:
        Summarized legal analysis
    """
    # Combine chunks for risk detection
    combined_text = "\n".join(chunks)
    
    # Detect risks
    risks = detect_legal_risks(combined_text)
    
    # Get system note for the style
    system_note = LEGAL_STYLE_NOTES.get(style, LEGAL_NOTE)
    
    # Adjust length based on style
    if style in ["tos-simplified", "privacy-summary"]:
        max_length = 400
        min_length = 60
    elif style == "risk-focused":
        max_length = 300
        min_length = 50
    else:
        max_length = 250
        min_length = 40
    
    # Generate summary
    summary = summarize_chunks(
        chunks=chunks,
        style=style,
        system_note=system_note,
        max_length=max_length,
        min_length=min_length
    )
    
    # Append risk summary if risks found
    if risks and style != "risk-focused":
        risk_summary = "\n\n⚠️ Potential Risks Detected:\n"
        for risk in risks[:5]:  # Limit to top 5
            emoji = "🚨" if risk["level"] == "red" else "⚠️"
            risk_summary += f"{emoji} {risk['title']}\n"
        summary += risk_summary
    
    return summary

def get_legal_styles() -> List[dict]:
    """Get list of available legal summary styles"""
    return [
        {"id": style, "description": note.split(".")[0]} 
        for style, note in LEGAL_STYLE_NOTES.items()
    ]
