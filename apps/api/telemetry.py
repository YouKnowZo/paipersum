import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

def init_telemetry(app):
    """Initialize telemetry and monitoring"""
    try:
        # Initialize Sentry for error tracking
        init_sentry()
        
        # Initialize OpenTelemetry for distributed tracing
        init_opentelemetry()
        
        logger.info("Telemetry initialized successfully")
    
    except Exception as e:
        logger.warning(f"Failed to initialize telemetry: {e}")

def init_sentry():
    """Initialize Sentry error tracking"""
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
        
        dsn = os.getenv("SENTRY_DSN")
        if not dsn:
            logger.info("SENTRY_DSN not configured, skipping Sentry")
            return
        
        sentry_sdk.init(
            dsn=dsn,
            integrations=[
                FastApiIntegration(auto_enabling_instrumentations=False),
                SqlalchemyIntegration(),
            ],
            traces_sample_rate=0.1,  # 10% of transactions
            environment=os.getenv("ENVIRONMENT", "development"),
            release=os.getenv("APP_VERSION", "0.1.0"),
        )
        
        logger.info("Sentry initialized successfully")
    
    except ImportError:
        logger.warning("Sentry SDK not available")
    except Exception as e:
        logger.warning(f"Failed to initialize Sentry: {e}")

def init_opentelemetry():
    """Initialize OpenTelemetry distributed tracing"""
    try:
        from opentelemetry import trace
        from opentelemetry.exporter.jaeger.thrift import JaegerExporter
        from opentelemetry.exporter.prometheus import PrometheusMetricReader
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
        from opentelemetry.instrumentation.redis import RedisInstrumentor
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.sdk.metrics import MeterProvider
        from opentelemetry.sdk.resources import Resource
        
        # Only initialize if explicitly configured
        if not os.getenv("JAEGER_ENDPOINT") and not os.getenv("PROMETHEUS_ENDPOINT"):
            logger.info("OpenTelemetry not configured, skipping")
            return
        
        # Create resource
        resource = Resource.create({
            "service.name": "paipersum-api",
            "service.version": os.getenv("APP_VERSION", "0.1.0"),
            "deployment.environment": os.getenv("ENVIRONMENT", "development"),
        })
        
        # Configure tracing
        trace.set_tracer_provider(TracerProvider(resource=resource))
        tracer = trace.get_tracer(__name__)
        
        # Add Jaeger exporter if configured
        jaeger_endpoint = os.getenv("JAEGER_ENDPOINT")
        if jaeger_endpoint:
            jaeger_exporter = JaegerExporter(
                agent_host_name=jaeger_endpoint.split(":")[0],
                agent_port=int(jaeger_endpoint.split(":")[1]) if ":" in jaeger_endpoint else 14268,
            )
            span_processor = BatchSpanProcessor(jaeger_exporter)
            trace.get_tracer_provider().add_span_processor(span_processor)
        
        # Configure metrics
        prometheus_endpoint = os.getenv("PROMETHEUS_ENDPOINT")
        if prometheus_endpoint:
            from opentelemetry.exporter.prometheus import PrometheusMetricReader
            from opentelemetry.sdk.metrics import MeterProvider
            
            metric_reader = PrometheusMetricReader()
            meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
            
            # Note: This would need to be integrated with your metrics collection
        
        # Instrument libraries
        FastAPIInstrumentor.instrument_app(app)
        SQLAlchemyInstrumentor().instrument()
        RedisInstrumentor().instrument()
        
        logger.info("OpenTelemetry initialized successfully")
    
    except ImportError:
        logger.warning("OpenTelemetry libraries not available")
    except Exception as e:
        logger.warning(f"Failed to initialize OpenTelemetry: {e}")

def log_request(request, response_time: float, status_code: int):
    """Log request details for monitoring"""
    try:
        client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
        user_agent = request.headers.get("User-Agent", "unknown")
        
        log_data = {
            "method": request.method,
            "path": request.url.path,
            "status_code": status_code,
            "response_time": response_time,
            "client_ip": client_ip,
            "user_agent": user_agent,
        }
        
        logger.info(f"Request: {log_data}")
    
    except Exception as e:
        logger.warning(f"Failed to log request: {e}")

def log_error(error: Exception, context: dict = None):
    """Log error details for monitoring"""
    try:
        error_data = {
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context or {},
        }
        
        logger.error(f"Error: {error_data}")
    
    except Exception as e:
        logger.warning(f"Failed to log error: {e}")