"""Storage utilities for temporary files"""
import os
import shutil
import tempfile
from pathlib import Path

UPLOAD_ROOT = os.path.abspath('./uploads')
os.makedirs(UPLOAD_ROOT, exist_ok=True)

def save_temp(filename: str, data: bytes) -> str:
    """Save uploaded file temporarily"""
    td = tempfile.mkdtemp(dir=UPLOAD_ROOT)
    path = os.path.join(td, filename)
    with open(path, 'wb') as f:
        f.write(data)
    return path

def cleanup(path: str):
    """Clean up temporary file"""
    d = os.path.dirname(path)
    if os.path.isdir(d):
        shutil.rmtree(d, ignore_errors=True)
