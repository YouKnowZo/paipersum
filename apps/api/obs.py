"""Observability: logging, error handling, monitoring"""
import logging
import json
import uuid
from fastapi import Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("paipersum")
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)

async def add_request_id_middleware(request: Request, call_next):
    """Add request ID to all requests"""
    rid = str(uuid.uuid4())
    request.state.rid = rid
    
    # Log request
    logger.info(json.dumps({
        'level': 'info',
        'event': 'request',
        'rid': rid,
        'method': request.method,
        'path': request.url.path,
        'ip': request.client.host if request.client else None
    }))
    
    response = await call_next(request)
    response.headers['X-Request-ID'] = rid
    return response

def install_handlers(app):
    """Install error handlers and middleware"""
    
    @app.middleware('http')
    async def _rid(request: Request, call_next):
        return await add_request_id_middleware(request, call_next)
    
    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception):
        rid = getattr(request.state, 'rid', None)
        
        logger.error(json.dumps({
            'level': 'error',
            'event': 'unhandled_exception',
            'rid': rid,
            'path': request.url.path,
            'method': request.method,
            'error': repr(exc)
        }))
        
        return JSONResponse(
            {
                'error': 'internal_error',
                'message': 'An unexpected error occurred',
                'rid': rid
            },
            status_code=500
        )
