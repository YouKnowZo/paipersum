import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_analyze_endpoint_requires_auth():
    response = client.post("/analyze", json={"text": "test"})
    assert response.status_code == 401

def test_analyze_file_endpoint_requires_auth():
    response = client.post("/analyze-file", files={"file": ("test.txt", "test content", "text/plain")})
    assert response.status_code == 401

def test_documents_endpoint_requires_auth():
    response = client.get("/documents")
    assert response.status_code == 401

def test_me_endpoint_requires_auth():
    response = client.get("/me")
    assert response.status_code == 401