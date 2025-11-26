"""
Admin Cybersecurity Portal - Threat Monitoring & Security Dashboard
Tracks security events, attacks, and system health
"""

from fastapi import APIRouter, HTTPException, Request, Header
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict
import hashlib
import json
import os

router = APIRouter(prefix="/admin", tags=["admin"])

# In-memory threat store (use database in production)
THREAT_LOG = []
SECURITY_EVENTS = []
FAILED_LOGINS = defaultdict(int)
RATE_LIMIT_VIOLATIONS = defaultdict(int)
SUSPICIOUS_IPS = set()

# Admin authentication (use proper auth in production)
ADMIN_SECRET = os.getenv('ADMIN_SECRET', 'change-me-in-production')
ADMIN_TOKEN_HASH = hashlib.sha256(ADMIN_SECRET.encode()).hexdigest()


class SecurityEvent(BaseModel):
    timestamp: datetime
    event_type: str
    severity: str  # 'low', 'medium', 'high', 'critical'
    ip_address: str
    user_agent: str
    details: Dict
    blocked: bool


class ThreatReport(BaseModel):
    total_threats: int
    threats_24h: int
    threats_7d: int
    blocked_ips: int
    rate_limit_violations: int
    failed_logins: int
    suspicious_patterns: List[str]
    top_attackers: List[Dict]
    recent_events: List[SecurityEvent]


def log_security_event(
    event_type: str,
    severity: str,
    ip_address: str,
    user_agent: str,
    details: Dict,
    blocked: bool = False
):
    """Log a security event"""
    event = SecurityEvent(
        timestamp=datetime.utcnow(),
        event_type=event_type,
        severity=severity,
        ip_address=ip_address,
        user_agent=user_agent or 'Unknown',
        details=details,
        blocked=blocked
    )
    
    SECURITY_EVENTS.append(event)
    THREAT_LOG.append(event.dict())
    
    # Keep only last 1000 events
    if len(SECURITY_EVENTS) > 1000:
        SECURITY_EVENTS.pop(0)
        THREAT_LOG.pop(0)
    
    # Mark suspicious IPs
    if severity in ['high', 'critical']:
        SUSPICIOUS_IPS.add(ip_address)
    
    # Log to file (in production, use proper logging)
    log_entry = {
        'timestamp': event.timestamp.isoformat(),
        'event_type': event_type,
        'severity': severity,
        'ip': ip_address,
        'blocked': blocked
    }
    print(f"[SECURITY] {json.dumps(log_entry)}")


def check_admin_auth(authorization: Optional[str] = Header(None)) -> bool:
    """Verify admin authentication"""
    if not authorization:
        return False
    
    try:
        token = authorization.replace('Bearer ', '')
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        return token_hash == ADMIN_TOKEN_HASH
    except:
        return False


@router.get("/security-dashboard", response_model=ThreatReport)
async def get_security_dashboard(authorization: Optional[str] = Header(None)):
    """Get security dashboard data"""
    
    if not check_admin_auth(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)
    
    # Filter events by time
    events_24h = [e for e in SECURITY_EVENTS if e.timestamp >= last_24h]
    events_7d = [e for e in SECURITY_EVENTS if e.timestamp >= last_7d]
    
    # Count by type
    event_types = defaultdict(int)
    ip_counts = defaultdict(int)
    
    for event in events_7d:
        event_types[event.event_type] += 1
        ip_counts[event.ip_address] += 1
    
    # Top attackers
    top_attackers = sorted(
        ip_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    
    top_attackers_list = [
        {'ip': ip, 'count': count, 'blocked': ip in SUSPICIOUS_IPS}
        for ip, count in top_attackers
    ]
    
    # Detect suspicious patterns
    suspicious_patterns = []
    
    if len(events_24h) > 100:
        suspicious_patterns.append("High volume of security events in last 24h")
    
    if len(SUSPICIOUS_IPS) > 50:
        suspicious_patterns.append("Large number of suspicious IP addresses")
    
    if sum(RATE_LIMIT_VIOLATIONS.values()) > 200:
        suspicious_patterns.append("Excessive rate limit violations")
    
    if sum(FAILED_LOGINS.values()) > 50:
        suspicious_patterns.append("Multiple failed login attempts detected")
    
    return ThreatReport(
        total_threats=len(SECURITY_EVENTS),
        threats_24h=len(events_24h),
        threats_7d=len(events_7d),
        blocked_ips=len(SUSPICIOUS_IPS),
        rate_limit_violations=sum(RATE_LIMIT_VIOLATIONS.values()),
        failed_logins=sum(FAILED_LOGINS.values()),
        suspicious_patterns=suspicious_patterns,
        top_attackers=top_attackers_list,
        recent_events=[e.dict() for e in events_24h[-20:]]
    )


@router.get("/security-events")
async def get_security_events(
    limit: int = 100,
    severity: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Get recent security events"""
    
    if not check_admin_auth(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    events = SECURITY_EVENTS[-limit:]
    
    if severity:
        events = [e for e in events if e.severity == severity]
    
    return {
        'events': [e.dict() for e in reversed(events)],
        'total': len(events)
    }


@router.post("/block-ip/{ip_address}")
async def block_ip(
    ip_address: str,
    authorization: Optional[str] = Header(None)
):
    """Block an IP address"""
    
    if not check_admin_auth(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    SUSPICIOUS_IPS.add(ip_address)
    
    log_security_event(
        event_type='admin_block',
        severity='medium',
        ip_address=ip_address,
        user_agent='Admin',
        details={'action': 'ip_blocked'},
        blocked=True
    )
    
    return {'status': 'blocked', 'ip': ip_address}


@router.post("/unblock-ip/{ip_address}")
async def unblock_ip(
    ip_address: str,
    authorization: Optional[str] = Header(None)
):
    """Unblock an IP address"""
    
    if not check_admin_auth(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    SUSPICIOUS_IPS.discard(ip_address)
    
    return {'status': 'unblocked', 'ip': ip_address}


@router.get("/dashboard", response_class=HTMLResponse)
async def admin_dashboard(authorization: Optional[str] = Header(None)):
    """Admin security dashboard HTML page"""
    
    if not check_admin_auth(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>PaiperSum Security Dashboard</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #0a0e27;
                color: #e0e0e0;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            .header h1 { color: white; font-size: 32px; margin-bottom: 10px; }
            .header p { color: rgba(255,255,255,0.9); }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: #1a1f3a;
                padding: 25px;
                border-radius: 12px;
                border-left: 4px solid #667eea;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            .stat-card h3 {
                color: #a0a0a0;
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            .stat-card .value {
                color: #fff;
                font-size: 36px;
                font-weight: bold;
            }
            .stat-card.critical { border-color: #ef4444; }
            .stat-card.warning { border-color: #f59e0b; }
            .stat-card.success { border-color: #10b981; }
            .events-table {
                background: #1a1f3a;
                border-radius: 12px;
                padding: 20px;
                overflow-x: auto;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th {
                text-align: left;
                padding: 15px;
                color: #a0a0a0;
                border-bottom: 2px solid #2d3555;
            }
            td {
                padding: 15px;
                border-bottom: 1px solid #2d3555;
            }
            .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
            }
            .badge.critical { background: #ef4444; color: white; }
            .badge.high { background: #f59e0b; color: white; }
            .badge.medium { background: #3b82f6; color: white; }
            .badge.low { background: #6b7280; color: white; }
            .refresh-btn {
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .refresh-btn:hover { background: #5568d3; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ Security Dashboard</h1>
            <p>Real-time threat monitoring and security events</p>
        </div>
        
        <button class="refresh-btn" onclick="loadDashboard()">🔄 Refresh</button>
        
        <div class="stats" id="stats"></div>
        <div class="events-table">
            <h2 style="margin-bottom: 20px;">Recent Security Events</h2>
            <div id="events"></div>
        </div>
        
        <script>
            async function loadDashboard() {
                const token = localStorage.getItem('admin_token') || prompt('Admin Token:');
                if (!token) return;
                localStorage.setItem('admin_token', token);
                
                const response = await fetch('/admin/security-dashboard', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await response.json();
                
                // Stats
                document.getElementById('stats').innerHTML = `
                    <div class="stat-card critical">
                        <h3>Threats (24h)</h3>
                        <div class="value">${data.threats_24h}</div>
                    </div>
                    <div class="stat-card warning">
                        <h3>Blocked IPs</h3>
                        <div class="value">${data.blocked_ips}</div>
                    </div>
                    <div class="stat-card warning">
                        <h3>Rate Limit Violations</h3>
                        <div class="value">${data.rate_limit_violations}</div>
                    </div>
                    <div class="stat-card success">
                        <h3>Total Events</h3>
                        <div class="value">${data.total_threats}</div>
                    </div>
                `;
                
                // Events
                let eventsHtml = '<table><tr><th>Time</th><th>Type</th><th>Severity</th><th>IP</th><th>Blocked</th></tr>';
                data.recent_events.forEach(e => {
                    eventsHtml += `
                        <tr>
                            <td>${new Date(e.timestamp).toLocaleString()}</td>
                            <td>${e.event_type}</td>
                            <td><span class="badge ${e.severity}">${e.severity}</span></td>
                            <td>${e.ip_address}</td>
                            <td>${e.blocked ? '✅' : '❌'}</td>
                        </tr>
                    `;
                });
                eventsHtml += '</table>';
                document.getElementById('events').innerHTML = eventsHtml;
            }
            
            loadDashboard();
            setInterval(loadDashboard, 30000); // Refresh every 30s
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html)
