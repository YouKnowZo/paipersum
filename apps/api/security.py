"""Security: rate limiting, headers, validation"""
from fastapi import Request
from fastapi.responses import Response
from time import time
from collections import defaultdict

# Simple in-memory rate limiting (use Redis in production)
_BUCKET = defaultdict(lambda: {'t': 0, 'c': 0})
WINDOW = 10  # seconds
LIMIT = 30   # requests per window

async def rate_limit(request: Request, call_next):
    """Rate limit requests per IP"""
    if not request.client:
        return await call_next(request)
    
    ip = request.client.host
    b = _BUCKET[ip]
    now = int(time())
    
    # Reset bucket if in new window
    if now != b['t']:
        b['t'] = now
        b['c'] = 0
    
    b['c'] += 1
    
    if b['c'] > LIMIT:
        return Response(
            'Too Many Requests - Rate limit exceeded',
            status_code=429,
            headers={'Retry-After': '10'}
        )
    
    response = await call_next(request)
    response.headers['X-RateLimit-Limit'] = str(LIMIT)
    response.headers['X-RateLimit-Remaining'] = str(max(0, LIMIT - b['c']))
    
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
    
    return response
