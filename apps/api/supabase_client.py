"""Utility to provide a cached Supabase client when credentials are set."""

from __future__ import annotations

from functools import lru_cache
import os
from typing import Optional

from supabase import Client, create_client  # type: ignore


@lru_cache(maxsize=1)
def get_supabase_client() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None
    return create_client(url, key)


__all__ = ["get_supabase_client"]
