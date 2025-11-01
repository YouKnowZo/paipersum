"""Utilities for splitting documents into overlapping chunks."""

from __future__ import annotations

from typing import List


def chunk_text(
    text: str,
    max_chars: int,
    overlap: int,
) -> List[str]:
    """Split text into roughly equal length chunks with overlap."""

    if not text:
        return []

    paragraphs = [p.strip() for p in text.splitlines() if p.strip()]
    if not paragraphs:
        paragraphs = [text]

    chunks: List[str] = []
    buffer: List[str] = []
    current_len = 0

    for paragraph in paragraphs:
        if current_len + len(paragraph) + 1 > max_chars and buffer:
            chunk = "\n".join(buffer)
            chunks.append(chunk)
            overlap_text = chunk[-overlap:] if overlap > 0 else ""
            buffer = [overlap_text] if overlap_text else []
            current_len = len(overlap_text)

        buffer.append(paragraph)
        current_len += len(paragraph) + 1

    if buffer:
        chunks.append("\n".join(buffer))

    # Guard against oversized single paragraphs
    normalized_chunks: List[str] = []
    for chunk in chunks:
        if len(chunk) <= max_chars:
            normalized_chunks.append(chunk)
            continue

        start = 0
        while start < len(chunk):
            end = min(start + max_chars, len(chunk))
            normalized_chunks.append(chunk[start:end])
            if overlap > 0:
                start = end - overlap
            else:
                start = end

    return normalized_chunks
