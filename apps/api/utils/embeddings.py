"""Embeddings and semantic search utilities"""
import numpy as np
from typing import List, Optional
from sentence_transformers import SentenceTransformer
import faiss

# Global model instance (lazy loaded)
_embed_model: Optional[SentenceTransformer] = None
_index: Optional[faiss.IndexFlatL2] = None
_kb_texts: List[str] = []
_dim: Optional[int] = None

def get_embed_model() -> SentenceTransformer:
    """Lazy load embedding model"""
    global _embed_model
    if _embed_model is None:
        try:
            # Use a lightweight, fast model
            _embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Warning: Could not load embedding model: {e}")
            raise
    return _embed_model

def get_index() -> faiss.IndexFlatL2:
    """Get or create FAISS index"""
    global _index, _dim
    if _index is None:
        model = get_embed_model()
        _dim = model.get_sentence_embedding_dimension()
        _index = faiss.IndexFlatL2(_dim)
    return _index

def get_kb_texts() -> List[str]:
    """Get knowledge base texts"""
    return _kb_texts

def add_documents(chunks: List[str]) -> None:
    """
    Add documents to the vector store
    
    Args:
        chunks: List of text chunks to add
    """
    if not chunks:
        return
    
    model = get_embed_model()
    index = get_index()
    
    # Generate embeddings
    embeddings = model.encode(chunks, convert_to_numpy=True, show_progress_bar=False)
    
    # Add to index
    index.add(embeddings.astype('float32'))
    
    # Store text chunks
    _kb_texts.extend(chunks)

def search(query: str, k: int = 5) -> List[str]:
    """
    Search for similar chunks
    
    Args:
        query: Search query
        k: Number of results to return
    
    Returns:
        List of matching text chunks
    """
    if not _kb_texts:
        return []
    
    model = get_embed_model()
    index = get_index()
    
    # Generate query embedding
    query_emb = model.encode([query], convert_to_numpy=True)
    
    # Search
    k = min(k, len(_kb_texts))
    distances, indices = index.search(query_emb.astype('float32'), k)
    
    # Return matching chunks
    results = []
    for idx in indices[0]:
        if 0 <= idx < len(_kb_texts):
            results.append(_kb_texts[idx])
    
    return results

def clear_index() -> None:
    """Clear the vector store"""
    global _index, _kb_texts, _dim
    _kb_texts = []
    if _dim:
        _index = faiss.IndexFlatL2(_dim)
    else:
        _index = None

def get_index_size() -> int:
    """Get number of documents in index"""
    return len(_kb_texts)
