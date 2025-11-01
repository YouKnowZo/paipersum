"""Simple feedback collection endpoints with JSON persistence."""

from __future__ import annotations

import json
import threading
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field


DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(exist_ok=True)
FEEDBACK_PATH = DATA_DIR / "feedback.json"

_lock = threading.Lock()


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


def _persist_feedback(records: List[FeedbackRecord]) -> None:
    serialized = [
        {
            "id": record.id,
            "name": record.name,
            "email": record.email,
            "rating": record.rating,
            "message": record.message,
            "created_at": record.created_at.isoformat(),
        }
        for record in records
    ]
    FEEDBACK_PATH.write_text(json.dumps(serialized, ensure_ascii=False, indent=2), encoding="utf-8")


router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.get("", response_model=list[FeedbackOut])
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
        records = _load_feedback()
        records.append(new_record)
        _persist_feedback(records)

    return FeedbackOut(**asdict(new_record))
