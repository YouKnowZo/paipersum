"""Universal processor for any document type"""
from typing import List, Optional
from .base_processor import summarize_chunks

# Style-specific system notes
STYLE_NOTES = {
    "concise": "Provide a concise summary focusing on key facts, names, dates, numbers, and main points.",
    "bulleted": "Provide a bulleted summary with key points, facts, and important details.",
    "tl;dr": "Provide a very brief TL;DR summary in 2-3 sentences.",
    "executive": "Provide an executive summary suitable for busy professionals. Include key decisions, numbers, and action items.",
    "extract-key-clauses": "Extract and summarize key clauses, terms, and important sections.",
    "action-items": "Extract and list all action items, deadlines, tasks, and required steps.",
    "timeline": "Extract and organize information chronologically with dates and events.",
    "people-roles": "Extract and summarize key people, their roles, responsibilities, and contact information.",
    "cookbook": "Extract recipes, ingredients, cooking times, and instructions.",
    "job-posting": "Extract job title, requirements, benefits, salary range, and application details.",
    "chat-history": "Summarize conversation topics, key decisions, and action items.",
    "map-legend": "Extract and explain map features, locations, and navigation instructions.",
    "court-records": "Extract case details, parties involved, dates, charges, and outcomes.",
    "book": "Provide chapter summaries, key themes, characters, and plot points.",
}

def summarize_universal(
    chunks: List[str],
    style: str = "concise",
    document_type: Optional[str] = None
) -> str:
    """
    Summarize any document type using universal summarization
    
    Args:
        chunks: List of text chunks to summarize
        style: Summary style (see STYLE_NOTES)
        document_type: Optional document type hint (e.g., "book", "cookbook", "job-posting")
    
    Returns:
        Summarized text
    """
    # Use document_type-specific style if available, otherwise use provided style
    style_key = document_type if document_type and document_type in STYLE_NOTES else style
    
    # Get system note for the style
    system_note = STYLE_NOTES.get(style_key, STYLE_NOTES["concise"])
    
    # Adjust max_length based on style
    if style in ["tl;dr"]:
        max_length = 100
        min_length = 20
    elif style in ["bulleted", "action-items", "people-roles"]:
        max_length = 400
        min_length = 50
    elif style in ["executive", "extract-key-clauses"]:
        max_length = 300
        min_length = 40
    else:
        max_length = 200
        min_length = 30
    
    return summarize_chunks(
        chunks=chunks,
        style=style,
        system_note=system_note,
        max_length=max_length,
        min_length=min_length
    )

def get_available_styles() -> List[dict]:
    """Get list of available summary styles"""
    return [
        {"id": style, "description": note.split(".")[0]} 
        for style, note in STYLE_NOTES.items()
    ]
