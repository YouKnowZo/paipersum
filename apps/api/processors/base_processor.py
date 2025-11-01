"""Base processor with common summarization logic"""
from typing import List, Optional
from transformers import pipeline

# Global summarizer instance (lazy loaded)
_summarizer: Optional[pipeline] = None

def get_summarizer():
    """Lazy load summarizer model"""
    global _summarizer
    if _summarizer is None:
        try:
            _summarizer = pipeline(
                "summarization", 
                model="facebook/bart-large-cnn", 
                device=-1  # CPU fallback
            )
        except Exception as e:
            print(f"Warning: Could not load summarizer: {e}")
            # Fallback to a simpler model
            try:
                _summarizer = pipeline(
                    "summarization",
                    model="t5-small",
                    device=-1
                )
            except Exception as e2:
                print(f"Error: Could not load fallback summarizer: {e2}")
                raise
    return _summarizer

def summarize_chunks(
    chunks: List[str], 
    style: str = "concise",
    system_note: str = "",
    max_length: int = 200,
    min_length: int = 20
) -> str:
    """
    Summarize text chunks using the base summarizer
    
    Args:
        chunks: List of text chunks to summarize
        style: Summary style (e.g., "concise", "bulleted", "extract-key-clauses")
        system_note: Additional instructions for the summarizer
        max_length: Maximum summary length
        min_length: Minimum summary length
    
    Returns:
        Summarized text
    """
    summarizer = get_summarizer()
    
    if not chunks:
        return "No content to summarize."
    
    # Combine chunks with separators
    combined_text = "\n---\n".join(chunks)
    
    # Limit input size (models have token limits)
    max_input_chars = 50000  # Conservative limit for BART
    if len(combined_text) > max_input_chars:
        combined_text = combined_text[:max_input_chars] + "..."
    
    # Build prompt
    prompt = f"{system_note}\n\n{combined_text}" if system_note else combined_text
    
    try:
        result = summarizer(
            prompt,
            max_length=max_length,
            min_length=min_length,
            do_sample=False
        )
        
        if isinstance(result, list) and len(result) > 0:
            return result[0].get('summary_text', '')
        elif isinstance(result, dict):
            return result.get('summary_text', '')
        else:
            return str(result)
    except Exception as e:
        print(f"Summarization error: {e}")
        # Fallback: return first chunk with truncation
        return chunks[0][:max_length] + "..." if chunks else ""
