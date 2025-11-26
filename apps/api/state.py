from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List

DATA_DIR = Path(__file__).resolve().parent / 'data'
STATE_FILE = DATA_DIR / 'state.json'

DEFAULT_STATE: Dict[str, Any] = {
    "analyses": [],
    "threat_events": [],
    "config": {
        "rate_limit_window": 10,
        "rate_limit_limit": 30,
        "maintenance_mode": False,
        "allowed_admin_ips": []
    },
    "billing": {
        "plan": "Operator",
        "plan_price": 49,
        "currency": "USD",
        "seats_included": 10,
        "seats_used": 6,
        "mrr": 294,
        "renews_on": "2025-12-01"
    },
    "customers": [
        {"name": "Northwind Legal", "status": "active", "seats": 25},
        {"name": "Acme Ventures", "status": "trial", "seats": 5},
        {"name": "Nimbus Security", "status": "active", "seats": 40}
    ]
}

def _ensure_state_file() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not STATE_FILE.exists():
        STATE_FILE.write_text(json.dumps(DEFAULT_STATE, indent=2))

def _load_state() -> Dict[str, Any]:
    _ensure_state_file()
    try:
        with STATE_FILE.open() as fh:
            data = json.load(fh)
    except json.JSONDecodeError:
        data = deepcopy(DEFAULT_STATE)
        save_state(data)
    return data

STATE: Dict[str, Any] = _load_state()

def save_state(data: Dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with STATE_FILE.open('w') as fh:
        json.dump(data, fh, indent=2)

def record_analysis(entry: Dict[str, Any]) -> None:
    analyses: List[Dict[str, Any]] = STATE.setdefault('analyses', [])
    analyses.insert(0, entry)
    STATE['analyses'] = analyses[:1000]
    save_state(STATE)

def get_analyses() -> List[Dict[str, Any]]:
    return list(STATE.get('analyses', []))

def get_config() -> Dict[str, Any]:
    return dict(STATE.get('config', DEFAULT_STATE['config']))

def update_config(updates: Dict[str, Any]) -> Dict[str, Any]:
    config = get_config()
    config.update(updates)
    STATE['config'] = config
    save_state(STATE)
    return config

def get_billing() -> Dict[str, Any]:
    return dict(STATE.get('billing', DEFAULT_STATE['billing']))

def update_billing(updates: Dict[str, Any]) -> Dict[str, Any]:
    billing = get_billing()
    billing.update(updates)
    STATE['billing'] = billing
    save_state(STATE)
    return billing

def get_customers() -> List[Dict[str, Any]]:
    return list(STATE.get('customers', DEFAULT_STATE['customers']))

def upsert_threat_events(events: List[Dict[str, Any]]) -> None:
    STATE['threat_events'] = events
    save_state(STATE)

def get_threat_events() -> List[Dict[str, Any]]:
    return list(STATE.get('threat_events', []))
