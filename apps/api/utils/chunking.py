"""Text chunking utilities"""
from typing import List

def chunk_text(
    text: str,
    max_chars: int = 3000,
    overlap: int = 200,
    min_chunk_size: int = 100
) -> List[str]:
    """
    Split text into overlapping chunks
    
    Args:
        text: Text to chunk
        max_chars: Maximum characters per chunk
        overlap: Characters to overlap between chunks
        min_chunk_size: Minimum chunk size (smaller chunks are merged)
    
    Returns:
        List of text chunks
    """
    if not text or len(text) <= max_chars:
        return [text] if text else []
    
    chunks = []
    i = 0
    
    while i < len(text):
        chunk = text[i:i + max_chars]
        
        # Try to break at sentence boundary
        if i + max_chars < len(text):
            # Look for sentence endings
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            break_point = max(last_period, last_newline)
            
            if break_point > max_chars * 0.5:  # Only break if we're past halfway
                chunk = chunk[:break_point + 1]
                i += break_point + 1 - overlap
            else:
                i += max_chars - overlap
        else:
            i += max_chars
        
        chunk = chunk.strip()
        if len(chunk) >= min_chunk_size:
            chunks.append(chunk)
        elif chunks:
            # Merge small chunk with previous
            chunks[-1] += " " + chunk
    
    # Merge any remaining small chunks
    final_chunks = []
    for chunk in chunks:
        if len(chunk) < min_chunk_size and final_chunks:
            final_chunks[-1] += " " + chunk
        else:
            final_chunks.append(chunk)
    
    return final_chunks if final_chunks else [text]
