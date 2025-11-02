"""Document-specific AI chat - Ask questions about YOUR document"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..utils.embeddings import search, get_kb_texts

router = APIRouter()

class ChatMessage(BaseModel):
    question: str
    document_context: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    confidence: float

@router.post("/chat", response_model=ChatResponse)
async def chat_with_document(message: ChatMessage):
    """
    Ask questions about your uploaded document
    
    This is what makes PaiperSum different from ChatGPT:
    - ChatGPT: Generic answers, no document context
    - PaiperSum: Answers based on YOUR specific document
    """
    kb_texts = get_kb_texts()
    if not kb_texts:
        raise HTTPException(
            status_code=400,
            detail="No document uploaded. Please upload a document first."
        )
    
    # Search for relevant chunks
    relevant_chunks = search(message.question, k=5)
    
    if not relevant_chunks:
        return ChatResponse(
            answer="I couldn't find relevant information in your document. Try uploading a document first or asking a different question.",
            sources=[],
            confidence=0.0
        )
    
    # Build context from relevant chunks
    context = "\n---\n".join(relevant_chunks[:3])
    
    # Simple answer generation based on context
    # In production, use a proper LLM here
    answer_parts = []
    
    # Look for direct answers in context
    question_lower = message.question.lower()
    for chunk in relevant_chunks[:3]:
        if any(word in chunk.lower() for word in question_lower.split()):
            answer_parts.append(chunk[:200])
    
    if answer_parts:
        answer = f"Based on your document:\n\n{answer_parts[0]}\n\n"
        if len(answer_parts) > 1:
            answer += f"Additional context: {answer_parts[1][:150]}..."
    else:
        answer = f"I found relevant information in your document related to '{message.question}'. Here's what it says:\n\n{relevant_chunks[0][:300]}..."
    
    # Add explanation
    answer += "\n\n?? This answer is based on YOUR specific document, not generic legal advice."
    
    # Calculate confidence based on how many chunks found
    confidence = min(1.0, len(relevant_chunks) / 5.0)
    
    return ChatResponse(
        answer=answer,
        sources=relevant_chunks[:3],
        confidence=confidence
    )
