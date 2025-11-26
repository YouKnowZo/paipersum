"""
Auth0 JWT token verification for FastAPI
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional, Dict
import requests
import os
from functools import lru_cache

security = HTTPBearer()

# Auth0 configuration
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "your-tenant.us.auth0.com")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "https://api.paipersum.com")
AUTH0_ALGORITHMS = ["RS256"]


@lru_cache()
def get_auth0_public_key():
    """
    Get Auth0's public key for JWT verification (cached)
    """
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    try:
        response = requests.get(jwks_url, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Failed to fetch Auth0 public key: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication configuration error"
        )


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Verify Auth0 JWT token
    
    Returns the decoded token payload with user info:
    {
        'sub': 'auth0|123456',  # User ID
        'email': 'user@example.com',
        'name': 'User Name',
        ...
    }
    """
    token = credentials.credentials
    
    try:
        # Get Auth0's public key
        jwks = get_auth0_public_key()
        
        # Get the key ID from token header
        unverified_header = jwt.get_unverified_header(token)
        
        # Find the right key
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        
        if not rsa_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find appropriate key"
            )
        
        # Verify and decode token
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=AUTH0_ALGORITHMS,
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        
        return payload
        
    except JWTError as e:
        print(f"❌ JWT verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"❌ Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )


def verify_token_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[Dict]:
    """
    Verify token if provided, return None if not
    Useful for endpoints that work with or without auth
    """
    if not credentials:
        return None
    try:
        return verify_token(credentials)
    except HTTPException:
        return None


# For backward compatibility with localStorage auth (temporary)
def get_current_user_fallback(
    token: Optional[Dict] = Depends(verify_token_optional)
) -> Optional[Dict]:
    """
    Get current user from Auth0 token or allow localStorage fallback
    This is temporary during migration period
    """
    return token


# Admin verification (check if user has admin role)
def verify_admin(token: Dict = Depends(verify_token)) -> Dict:
    """
    Verify that user has admin role
    """
    roles = token.get("permissions", []) or token.get("roles", [])
    
    if "admin" not in roles and "Admin" not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return token


# Pro subscription verification
def verify_pro_user(token: Dict = Depends(verify_token)) -> Dict:
    """
    Verify that user has Pro subscription
    Note: This checks the token. In production, check database subscription status.
    """
    # This is a simplified version
    # In production, query the database to check actual subscription status
    is_pro = token.get("is_pro", False)
    
    if not is_pro:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Pro subscription required for this feature"
        )
    
    return token
