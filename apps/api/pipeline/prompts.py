"""Prompt templates and helper utilities for the summarization pipeline."""

from __future__ import annotations

from typing import Dict


MODE_GUIDANCE: Dict[str, str] = {
    "universal": (
        "You are an expert analyst summarizing arbitrary content. Focus on key facts, figures,"
        " dates, decisions, and action items. Respond in plain language and avoid speculation."
    ),
    "legal": (
        "You are a contract analyst. Extract parties, obligations, rights, limitations, data"
        " practices, termination rules, dispute mechanisms, and financial terms. Flag material"
        " risks in neutral language and avoid providing legal advice."
    ),
}


STYLE_GUIDANCE: Dict[str, str] = {
    "concise": "Return a short paragraph (3-5 sentences).",
    "bulleted": "Return 4-6 bullet points, each focusing on a distinct takeaway.",
    "executive": "Return a numbered list of insights for executives, with implications.",
    "action-items": "Return a checklist of action items with owners if available.",
    "tl;dr": "Return a single sentence TL;DR with the most critical takeaway.",
}


def build_prompt(mode: str, style: str, instructions: str | None) -> str:
    mode_note = MODE_GUIDANCE.get(mode, MODE_GUIDANCE["universal"])
    style_note = STYLE_GUIDANCE.get(style.lower(), f"Return a {style} style summary.")
    custom = f"Additional user instructions: {instructions}" if instructions else ""

    parts = [mode_note, style_note]
    if custom:
        parts.append(custom)

    return "\n".join(part for part in parts if part)


__all__ = ["build_prompt", "MODE_GUIDANCE", "STYLE_GUIDANCE"]
