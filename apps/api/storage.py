import os
import boto3
from minio import Minio
from minio.error import S3Error
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class StorageClient:
    def __init__(self):
        self.client = None
        self.bucket_name = os.getenv("S3_BUCKET", "paipersum")
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize storage client based on configuration"""
        s3_endpoint = os.getenv("S3_ENDPOINT")
        access_key = os.getenv("S3_ACCESS_KEY")
        secret_key = os.getenv("S3_SECRET_KEY")
        
        if not all([s3_endpoint, access_key, secret_key]):
            logger.warning("Storage credentials not configured, using local storage")
            return
        
        try:
            if s3_endpoint.startswith("http://") or s3_endpoint.startswith("https://"):
                # MinIO or S3-compatible storage
                self.client = Minio(
                    s3_endpoint.replace("http://", "").replace("https://", ""),
                    access_key=access_key,
                    secret_key=secret_key,
                    secure=s3_endpoint.startswith("https://")
                )
            else:
                # AWS S3
                self.client = boto3.client(
                    's3',
                    aws_access_key_id=access_key,
                    aws_secret_access_key=secret_key,
                    region_name=os.getenv("AWS_REGION", "us-east-1")
                )
            
            # Ensure bucket exists
            self._ensure_bucket_exists()
            logger.info("Storage client initialized successfully")
        
        except Exception as e:
            logger.error(f"Failed to initialize storage client: {e}")
            self.client = None
    
    def _ensure_bucket_exists(self):
        """Ensure the storage bucket exists"""
        if not self.client:
            return
        
        try:
            if hasattr(self.client, 'bucket_exists'):  # MinIO
                if not self.client.bucket_exists(self.bucket_name):
                    self.client.make_bucket(self.bucket_name)
            else:  # boto3
                self.client.head_bucket(Bucket=self.bucket_name)
        except Exception as e:
            if hasattr(self.client, 'make_bucket'):  # MinIO
                self.client.make_bucket(self.bucket_name)
            else:  # boto3
                self.client.create_bucket(Bucket=self.bucket_name)
    
    def upload_file(self, file_content: bytes, file_key: str, content_type: str = "application/octet-stream") -> bool:
        """Upload file to storage"""
        if not self.client:
            logger.warning("Storage client not available, file not uploaded")
            return False
        
        try:
            if hasattr(self.client, 'put_object'):  # MinIO
                self.client.put_object(
                    self.bucket_name,
                    file_key,
                    io.BytesIO(file_content),
                    length=len(file_content),
                    content_type=content_type
                )
            else:  # boto3
                self.client.put_object(
                    Bucket=self.bucket_name,
                    Key=file_key,
                    Body=file_content,
                    ContentType=content_type
                )
            
            logger.info(f"File uploaded successfully: {file_key}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to upload file {file_key}: {e}")
            return False
    
    def download_file(self, file_key: str) -> Optional[bytes]:
        """Download file from storage"""
        if not self.client:
            logger.warning("Storage client not available")
            return None
        
        try:
            if hasattr(self.client, 'get_object'):  # MinIO
                response = self.client.get_object(self.bucket_name, file_key)
                return response.read()
            else:  # boto3
                response = self.client.get_object(Bucket=self.bucket_name, Key=file_key)
                return response['Body'].read()
        
        except Exception as e:
            logger.error(f"Failed to download file {file_key}: {e}")
            return None
    
    def delete_file(self, file_key: str) -> bool:
        """Delete file from storage"""
        if not self.client:
            logger.warning("Storage client not available")
            return False
        
        try:
            if hasattr(self.client, 'remove_object'):  # MinIO
                self.client.remove_object(self.bucket_name, file_key)
            else:  # boto3
                self.client.delete_object(Bucket=self.bucket_name, Key=file_key)
            
            logger.info(f"File deleted successfully: {file_key}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to delete file {file_key}: {e}")
            return False
    
    def get_file_url(self, file_key: str, expires_in: int = 3600) -> Optional[str]:
        """Get presigned URL for file access"""
        if not self.client:
            return None
        
        try:
            if hasattr(self.client, 'presigned_get_object'):  # MinIO
                return self.client.presigned_get_object(self.bucket_name, file_key, expires=timedelta(seconds=expires_in))
            else:  # boto3
                return self.client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket_name, 'Key': file_key},
                    ExpiresIn=expires_in
                )
        except Exception as e:
            logger.error(f"Failed to generate presigned URL for {file_key}: {e}")
            return None

# Global storage client instance
_storage_client = None

def get_storage_client() -> StorageClient:
    """Get storage client instance"""
    global _storage_client
    if _storage_client is None:
        _storage_client = StorageClient()
    return _storage_client