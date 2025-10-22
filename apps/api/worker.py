#!/usr/bin/env python3
"""
Background worker for processing heavy tasks like OCR and ML analysis
"""
import os
import sys
import logging
from rq import Worker, Queue, Connection
import redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main worker process"""
    try:
        # Connect to Redis
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
        conn = redis.from_url(redis_url)
        
        # Create queues
        queues = [Queue('default', connection=conn)]
        
        # Start worker
        with Connection(conn):
            worker = Worker(queues)
            logger.info("Starting background worker...")
            worker.work()
    
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
    except Exception as e:
        logger.error(f"Worker error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()