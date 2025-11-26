"""
Admin Cybersecurity Portal - Threat Monitoring & Analytics
Tracks all security events, suspicious activity, and system health
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Dict, Optional, Literal
from datetime import datetime, timedelta
from collections import defaultdict, deque
import time
import hashlib
import json

router = APIRouter(prefix="/admin", tags=["Admin"])

# Admin authentication (simple token-based, upgrade to JWT in production)
ADMIN_TOKEN = "admin_secure_token_change_in_production"

def verify_admin(authorization: str = Header(None)):
    """Verify admin token"""
    if not authorization or authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# In-memory storage (use Redis/PostgreSQL in production)
class SecurityEvent(BaseModel):
    id: str
    timestamp: datetime
    event_type: Literal['rate_limit', 'auth_failure', 'suspicious_activity', 'error', 'ddos_attempt']
    severity: Literal['low', 'medium', 'high', 'critical']
    ip_address: str
    user_agent: Optional[str] = None
    endpoint: str
    details: Dict
    country: Optional[str] = None
    blocked: bool = False

class SystemMetrics(BaseModel):
    timestamp: datetime
    requests_per_minute: int
    avg_response_time: float
    error_rate: float
    active_users: int
    cpu_usage: float
    memory_usage: float
    disk_usage: float

class ThreatAnalysis(BaseModel):
    total_threats: int
    critical_threats: int
    blocked_ips: List[str]
    top_attack_vectors: List[Dict[str, int]]
    geographic_distribution: Dict[str, int]
    timeline: List[Dict]

# Storage
security_events: deque = deque(maxlen=10000)  # Last 10k events
blocked_ips: set = set()
ip_reputation: Dict[str, Dict] = defaultdict(lambda: {
    'score': 100,  # 0-100, lower is worse
    'violations': 0,
    'last_seen': None,
    'first_seen': None
})
metrics_history: deque = deque(maxlen=1440)  # 24 hours at 1-min intervals

def log_security_event(
    event_type: str,
    severity: str,
    ip_address: str,
    endpoint: str,
    details: Dict,
    user_agent: Optional[str] = None,
    auto_block: bool = False
):
    """Log a security event"""
    event_id = hashlib.md5(f"{time.time()}{ip_address}".encode()).hexdigest()[:12]
    
    event = SecurityEvent(
        id=event_id,
        timestamp=datetime.utcnow(),
        event_type=event_type,  # type: ignore
        severity=severity,  # type: ignore
        ip_address=ip_address,
        user_agent=user_agent,
        endpoint=endpoint,
        details=details,
        blocked=auto_block
    )
    
    security_events.append(event)
    
    # Update IP reputation
    rep = ip_reputation[ip_address]
    if not rep['first_seen']:
        rep['first_seen'] = datetime.utcnow()
    rep['last_seen'] = datetime.utcnow()
    rep['violations'] += 1
    
    # Decrease reputation score
    severity_penalty = {'low': 5, 'medium': 15, 'high': 30, 'critical': 50}
    rep['score'] = max(0, rep['score'] - severity_penalty.get(severity, 10))
    
    # Auto-block if reputation drops below threshold
    if rep['score'] < 20 or auto_block:
        blocked_ips.add(ip_address)
    
    return event

def analyze_threat_pattern(ip: str, events: List) -> Dict:
    """Analyze if IP shows attack patterns"""
    recent = [e for e in events if e.ip_address == ip and 
              (datetime.utcnow() - e.timestamp).seconds < 300]  # Last 5 min
    
    if len(recent) > 50:
        return {'threat': 'ddos', 'confidence': 0.95}
    
    if len(recent) > 20:
        return {'threat': 'brute_force', 'confidence': 0.85}
    
    error_rate = sum(1 for e in recent if e.event_type == 'error') / max(len(recent), 1)
    if error_rate > 0.8:
        return {'threat': 'vulnerability_scan', 'confidence': 0.75}
    
    return {'threat': None, 'confidence': 0}

@router.get("/security/dashboard")
async def get_security_dashboard(_: bool = Depends(verify_admin)):
    """Get real-time security dashboard data"""
    now = datetime.utcnow()
    last_hour = now - timedelta(hours=1)
    last_24h = now - timedelta(hours=24)
    
    # Filter recent events
    recent_events = [e for e in security_events if e.timestamp > last_hour]
    daily_events = [e for e in security_events if e.timestamp > last_24h]
    
    # Count by severity
    severity_counts = defaultdict(int)
    for event in recent_events:
        severity_counts[event.severity] += 1
    
    # Top attacking IPs
    ip_counts = defaultdict(int)
    for event in recent_events:
        if event.severity in ['high', 'critical']:
            ip_counts[event.ip_address] += 1
    top_ips = sorted(ip_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Attack vectors
    vector_counts = defaultdict(int)
    for event in recent_events:
        vector_counts[event.event_type] += 1
    
    # Timeline (events per 5-min bucket)
    timeline = defaultdict(int)
    for event in daily_events:
        bucket = event.timestamp.replace(minute=event.timestamp.minute // 5 * 5, second=0, microsecond=0)
        timeline[bucket] += 1
    
    timeline_data = [
        {'time': k.isoformat(), 'count': v} 
        for k, v in sorted(timeline.items())
    ]
    
    return {
        'overview': {
            'total_events_hour': len(recent_events),
            'total_events_day': len(daily_events),
            'critical_events': severity_counts['critical'],
            'high_events': severity_counts['high'],
            'blocked_ips_count': len(blocked_ips),
            'active_threats': sum(1 for ip in ip_reputation if ip_reputation[ip]['score'] < 50)
        },
        'severity_breakdown': dict(severity_counts),
        'top_attacking_ips': [{'ip': ip, 'count': count, 'reputation': ip_reputation[ip]['score']} for ip, count in top_ips],
        'attack_vectors': dict(vector_counts),
        'timeline': timeline_data,
        'blocked_ips': list(blocked_ips),
    }

@router.get("/security/events")
async def get_security_events(
    _: bool = Depends(verify_admin),
    limit: int = 100,
    severity: Optional[str] = None,
    event_type: Optional[str] = None
):
    """Get recent security events with filtering"""
    events = list(security_events)
    
    if severity:
        events = [e for e in events if e.severity == severity]
    
    if event_type:
        events = [e for e in events if e.event_type == event_type]
    
    # Sort by timestamp desc
    events.sort(key=lambda x: x.timestamp, reverse=True)
    
    return {
        'total': len(events),
        'events': [e.dict() for e in events[:limit]]
    }

@router.get("/security/ip/{ip_address}")
async def get_ip_reputation(ip_address: str, _: bool = Depends(verify_admin)):
    """Get detailed information about an IP address"""
    rep = ip_reputation.get(ip_address)
    if not rep or not rep.get('first_seen'):
        raise HTTPException(status_code=404, detail="IP not found in records")
    
    # Get events for this IP
    ip_events = [e for e in security_events if e.ip_address == ip_address]
    
    # Analyze threat pattern
    threat_analysis = analyze_threat_pattern(ip_address, list(security_events))
    
    return {
        'ip_address': ip_address,
        'reputation_score': rep['score'],
        'total_violations': rep['violations'],
        'first_seen': rep['first_seen'],
        'last_seen': rep['last_seen'],
        'is_blocked': ip_address in blocked_ips,
        'threat_analysis': threat_analysis,
        'recent_events': [e.dict() for e in sorted(ip_events, key=lambda x: x.timestamp, reverse=True)[:20]]
    }

@router.post("/security/ip/{ip_address}/block")
async def block_ip(ip_address: str, _: bool = Depends(verify_admin)):
    """Manually block an IP address"""
    blocked_ips.add(ip_address)
    log_security_event(
        event_type='suspicious_activity',
        severity='high',
        ip_address=ip_address,
        endpoint='/admin',
        details={'action': 'manual_block', 'admin': 'system'},
        auto_block=True
    )
    return {'message': f'IP {ip_address} blocked', 'blocked_ips_count': len(blocked_ips)}

@router.post("/security/ip/{ip_address}/unblock")
async def unblock_ip(ip_address: str, _: bool = Depends(verify_admin)):
    """Unblock an IP address"""
    if ip_address in blocked_ips:
        blocked_ips.remove(ip_address)
    
    # Reset reputation
    if ip_address in ip_reputation:
        ip_reputation[ip_address]['score'] = 70
    
    return {'message': f'IP {ip_address} unblocked'}

@router.get("/security/metrics")
async def get_system_metrics(_: bool = Depends(verify_admin)):
    """Get system performance metrics"""
    import psutil
    
    # Current metrics
    current = SystemMetrics(
        timestamp=datetime.utcnow(),
        requests_per_minute=len([e for e in security_events 
                                if (datetime.utcnow() - e.timestamp).seconds < 60]),
        avg_response_time=0.15,  # Mock, integrate with actual metrics
        error_rate=len([e for e in security_events 
                       if e.event_type == 'error' and 
                       (datetime.utcnow() - e.timestamp).seconds < 300]) / max(len(list(security_events)), 1),
        active_users=len(set(e.ip_address for e in security_events 
                           if (datetime.utcnow() - e.timestamp).seconds < 300)),
        cpu_usage=psutil.cpu_percent(),
        memory_usage=psutil.virtual_memory().percent,
        disk_usage=psutil.disk_usage('/').percent
    )
    
    metrics_history.append(current)
    
    return {
        'current': current.dict(),
        'history': [m.dict() for m in list(metrics_history)[-60:]]  # Last hour
    }

@router.get("/security/threats/analysis")
async def get_threat_analysis(_: bool = Depends(verify_admin)):
    """Get comprehensive threat analysis"""
    now = datetime.utcnow()
    last_hour = now - timedelta(hours=1)
    
    recent_events = [e for e in security_events if e.timestamp > last_hour]
    
    # Identify attack patterns
    attack_patterns = defaultdict(list)
    for event in recent_events:
        threat = analyze_threat_pattern(event.ip_address, list(security_events))
        if threat['threat']:
            attack_patterns[threat['threat']].append(event.ip_address)
    
    # Geographic distribution (mock, integrate with GeoIP)
    geo_dist = defaultdict(int)
    for event in recent_events:
        geo_dist['Unknown'] += 1  # Replace with actual GeoIP lookup
    
    return {
        'total_threats': len([e for e in recent_events if e.severity in ['high', 'critical']]),
        'critical_threats': len([e for e in recent_events if e.severity == 'critical']),
        'blocked_ips': list(blocked_ips),
        'attack_patterns': {k: len(set(v)) for k, v in attack_patterns.items()},
        'geographic_distribution': dict(geo_dist),
        'threat_timeline': [
            {
                'timestamp': e.timestamp.isoformat(),
                'type': e.event_type,
                'severity': e.severity,
                'ip': e.ip_address
            }
            for e in sorted(recent_events, key=lambda x: x.timestamp, reverse=True)[:50]
        ]
    }

@router.post("/security/clear-logs")
async def clear_security_logs(_: bool = Depends(verify_admin)):
    """Clear all security logs (use with caution)"""
    security_events.clear()
    return {'message': 'Security logs cleared'}

# Export functions for use in main app
__all__ = ['log_security_event', 'blocked_ips', 'router']
