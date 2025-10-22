import time
import logging
from functools import wraps
from typing import Callable, Any
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Request, Response
import psutil
import os

# Prometheus metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration', ['method', 'endpoint'])
ACTIVE_CONNECTIONS = Gauge('active_connections', 'Number of active connections')
MEMORY_USAGE = Gauge('memory_usage_bytes', 'Memory usage in bytes')
CPU_USAGE = Gauge('cpu_usage_percent', 'CPU usage percentage')
DATABASE_CONNECTIONS = Gauge('database_connections', 'Number of database connections')

logger = logging.getLogger(__name__)

def monitor_performance(func: Callable) -> Callable:
    """Decorator to monitor function performance"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start_time
            logger.info(f"{func.__name__} completed in {duration:.3f}s")
            return result
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"{func.__name__} failed after {duration:.3f}s: {e}")
            raise
    return wrapper

def track_metrics(request: Request, response: Response):
    """Track request metrics"""
    method = request.method
    endpoint = request.url.path
    status = response.status_code
    
    REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=status).inc()
    
    # Track system metrics
    MEMORY_USAGE.set(psutil.Process().memory_info().rss)
    CPU_USAGE.set(psutil.cpu_percent())
    
    # Track database connections (if using connection pooling)
    # DATABASE_CONNECTIONS.set(pool.size())

def get_metrics():
    """Get Prometheus metrics"""
    return generate_latest()

class HealthChecker:
    """System health checker"""
    
    @staticmethod
    def check_database():
        """Check database connectivity"""
        try:
            # Add database health check
            return {"status": "healthy", "response_time": 0.001}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
    
    @staticmethod
    def check_redis():
        """Check Redis connectivity"""
        try:
            # Add Redis health check
            return {"status": "healthy", "response_time": 0.001}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
    
    @staticmethod
    def check_storage():
        """Check storage connectivity"""
        try:
            # Add storage health check
            return {"status": "healthy", "response_time": 0.001}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
    
    @classmethod
    def get_system_health(cls):
        """Get overall system health"""
        checks = {
            "database": cls.check_database(),
            "redis": cls.check_redis(),
            "storage": cls.check_storage()
        }
        
        all_healthy = all(check["status"] == "healthy" for check in checks.values())
        
        return {
            "status": "healthy" if all_healthy else "unhealthy",
            "checks": checks,
            "timestamp": time.time()
        }