import time
import logging
from fastapi import Request, Response
from collections import defaultdict
from typing import Dict, Tuple
import os

logger = logging.getLogger(__name__)

# Rate limiting configuration
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 100  # per window
RATE_LIMIT_BURST = 20  # burst allowance

# In-memory rate limiting (use Redis in production)
rate_limit_buckets: Dict[str, Dict[str, float]] = defaultdict(lambda: {
    'requests': 0,
    'window_start': time.time()
})

def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    # Check for forwarded headers first
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct connection
    if request.client:
        return request.client.host
    
    return "unknown"

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    client_ip = get_client_ip(request)
    current_time = time.time()
    
    # Get or create bucket for this IP
    bucket = rate_limit_buckets[client_ip]
    
    # Reset window if needed
    if current_time - bucket['window_start'] > RATE_LIMIT_WINDOW:
        bucket['requests'] = 0
        bucket['window_start'] = current_time
    
    # Check rate limit
    if bucket['requests'] >= RATE_LIMIT_MAX_REQUESTS:
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        return Response(
            content="Rate limit exceeded. Please try again later.",
            status_code=429,
            headers={
                "Retry-After": str(RATE_LIMIT_WINDOW),
                "X-RateLimit-Limit": str(RATE_LIMIT_MAX_REQUESTS),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(int(bucket['window_start'] + RATE_LIMIT_WINDOW))
            }
        )
    
    # Increment request count
    bucket['requests'] += 1
    
    # Add rate limit headers to response
    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(RATE_LIMIT_MAX_REQUESTS)
    response.headers["X-RateLimit-Remaining"] = str(RATE_LIMIT_MAX_REQUESTS - bucket['requests'])
    response.headers["X-RateLimit-Reset"] = str(int(bucket['window_start'] + RATE_LIMIT_WINDOW))
    
    return response

async def security_headers_middleware(request: Request, call_next):
    """Add security headers to response"""
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    # Content Security Policy
    csp = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self' https://api.stripe.com; "
        "frame-src 'none'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "form-action 'self'"
    )
    response.headers["Content-Security-Policy"] = csp
    
    # HSTS (only in production)
    if os.getenv("ENVIRONMENT") == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
    
    return response

def security_headers(request: Request, call_next):
    """Security headers middleware wrapper"""
    return security_headers_middleware(request, call_next)

def rate_limit(request: Request, call_next):
    """Rate limiting middleware wrapper"""
    return rate_limit_middleware(request, call_next)

# Input validation helpers
def validate_file_upload(file_content: bytes, filename: str, max_size: int = 10 * 1024 * 1024) -> Tuple[bool, str]:
    """Validate uploaded file"""
    # Check file size
    if len(file_content) > max_size:
        return False, f"File too large. Maximum size: {max_size // (1024*1024)}MB"
    
    # Check file extension
    allowed_extensions = ['.pdf', '.doc', '.docx', '.txt']
    file_ext = os.path.splitext(filename.lower())[1]
    if file_ext not in allowed_extensions:
        return False, f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
    
    # Check for suspicious content
    if b'<script' in file_content.lower() or b'javascript:' in file_content.lower():
        return False, "File contains potentially malicious content"
    
    return True, ""

def sanitize_text(text: str, max_length: int = 100000) -> str:
    """Sanitize input text"""
    # Limit length
    if len(text) > max_length:
        text = text[:max_length]
    
    # Remove null bytes and control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
    
    # Remove potential XSS
    dangerous_patterns = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'vbscript:',
        r'on\w+\s*=',
    ]
    
    import re
    for pattern in dangerous_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE | re.DOTALL)
    
    return text.strip()