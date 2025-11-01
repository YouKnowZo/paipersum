"""Simple feedback collection endpoints with JSON persistence."""

from __future__ import annotations

import json
import threading
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
import os
from typing import List

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, EmailStr, Field

from supabase_client import get_supabase_client


DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(exist_ok=True)
FEEDBACK_PATH = DATA_DIR / "feedback.json"

_lock = threading.Lock()
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")


class FeedbackIn(BaseModel):
    name: str = Field(..., max_length=80)
    email: EmailStr | None = Field(default=None)
    rating: int = Field(default=5, ge=1, le=5)
    message: str = Field(..., min_length=5, max_length=2000)


class FeedbackOut(BaseModel):
    id: str
    name: str
    email: EmailStr | None
    rating: int
    message: str
    created_at: datetime


@dataclass
class FeedbackRecord:
    id: str
    name: str
    email: str | None
    rating: int
    message: str
    created_at: datetime


def _load_feedback() -> List[FeedbackRecord]:
    client = get_supabase_client()
    if client:
        response = client.table("feedback").select("*").order("created_at", desc=True).execute()
        if response.error:
            raise HTTPException(status_code=500, detail=str(response.error))
        data = response.data or []
    else:
        if not FEEDBACK_PATH.exists():
            return []
        try:
            data = json.loads(FEEDBACK_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Feedback store is corrupted")

    records: List[FeedbackRecord] = []
    for item in data:
        try:
            records.append(
                FeedbackRecord(
                    id=item["id"],
                    name=item["name"],
                    email=item.get("email"),
                    rating=int(item.get("rating", 5)),
                    message=item["message"],
                    created_at=datetime.fromisoformat(item["created_at"]),
                )
            )
        except (KeyError, ValueError) as err:
            raise HTTPException(status_code=500, detail=f"Invalid feedback entry: {err}")
    return records


def _persist_feedback(record: FeedbackRecord) -> None:
    payload = {
        "id": record.id,
        "name": record.name,
        "email": record.email,
        "rating": record.rating,
        "message": record.message,
        "created_at": record.created_at.isoformat(),
    }

    client = get_supabase_client()
    if client:
        response = client.table("feedback").insert(payload).execute()
        if response.error:
            raise HTTPException(status_code=500, detail=str(response.error))
        return

    existing = []
    if FEEDBACK_PATH.exists():
        try:
            existing = json.loads(FEEDBACK_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Feedback store is corrupted")
    existing.append(payload)
    FEEDBACK_PATH.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")


router = APIRouter(prefix="/feedback", tags=["Feedback"])


def require_admin(admin_key: str | None = Header(default=None, alias="x-admin-key")) -> None:
    if not ADMIN_API_KEY:
        raise HTTPException(status_code=503, detail="Admin API key not configured")
    if not admin_key or admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("", response_model=list[FeedbackOut], dependencies=[Depends(require_admin)])
def list_feedback() -> List[FeedbackOut]:
    records = _load_feedback()
    # newest first
    records.sort(key=lambda rec: rec.created_at, reverse=True)
    return [FeedbackOut(**asdict(record)) for record in records]


@router.post("", response_model=FeedbackOut, status_code=201)
def submit_feedback(payload: FeedbackIn) -> FeedbackOut:
    now = datetime.utcnow()
    new_record = FeedbackRecord(
        id=f"fb_{int(now.timestamp()*1000)}",
        name=payload.name.strip(),
        email=payload.email.strip() if payload.email else None,
        rating=payload.rating,
        message=payload.message.strip(),
        created_at=now,
    )

    with _lock:
        _persist_feedback(new_record)

    return FeedbackOut(**asdict(new_record))
