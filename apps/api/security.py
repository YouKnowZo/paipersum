"""Security: rate limiting, headers, validation"""
from fastapi import Request
from fastapi.responses import Response
from time import time
from collections import defaultdict

from state import get_config

# Simple in-memory rate limiting (use Redis in production)
_BUCKET = defaultdict(lambda: {'start': 0, 'count': 0})
DEFAULT_WINDOW = 10  # seconds
DEFAULT_LIMIT = 30   # requests per window

async def rate_limit(request: Request, call_next):
    """Rate limit requests per IP"""
    if not request.client:
        return await call_next(request)
    
    ip = request.client.host
    b = _BUCKET[ip]
    now = time()
    
    config = get_config()
    window = int(config.get('rate_limit_window', DEFAULT_WINDOW))
    limit = int(config.get('rate_limit_limit', DEFAULT_LIMIT))
    
    if now - b['start'] >= window:
        b['start'] = now
        b['count'] = 0
    
    b['count'] += 1
    
    if b['count'] > limit:
        return Response(
            'Too Many Requests - Rate limit exceeded',
            status_code=429,
            headers={'Retry-After': str(window)}
        )
    
    response = await call_next(request)
    response.headers['X-RateLimit-Limit'] = str(limit)
    response.headers['X-RateLimit-Remaining'] = str(max(0, limit - b['count']))
    
    return response

async def security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Cross-Origin-Resource-Policy'] = 'same-origin'
    response.headers['Cache-Control'] = 'no-store'
    response.headers['Pragma'] = 'no-cache'
    
    return response
