"""
PaiperSum User Management API
Handles user persistence, Auth0 integration, and account management.
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import hashlib
import os
import json
import httpx

router = APIRouter(prefix="/api/users", tags=["users"])

# In-memory user store (replace with database in production)
# In production, use PostgreSQL, MongoDB, or Supabase
users_db: Dict[str, dict] = {}
device_user_map: Dict[str, str] = {}

class UserCreate(BaseModel):
    id: str
    email: EmailStr
    name: str
    isPro: bool = False
    docsThisMonth: int = 0
    totalDocsAnalyzed: int = 0
    totalSavings: int = 0
    address: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    createdAt: Optional[str] = None
    lastLoginAt: Optional[str] = None
    auth0Id: Optional[str] = None
    deviceId: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    docsThisMonth: Optional[int] = None
    totalDocsAnalyzed: Optional[int] = None
    totalSavings: Optional[int] = None
    isPro: Optional[bool] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    isPro: bool
    docsThisMonth: int
    totalDocsAnalyzed: int
    totalSavings: int
    address: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    createdAt: str
    lastLoginAt: str

def get_user_by_email(email: str) -> Optional[dict]:
    """Find user by email"""
    email_lower = email.lower()
    for user in users_db.values():
        if user.get('email', '').lower() == email_lower:
            return user
    return None

def get_user_by_device(device_id: str) -> Optional[dict]:
    """Find user by device ID"""
    user_id = device_user_map.get(device_id)
    if user_id:
        return users_db.get(user_id)
    return None

@router.get("/lookup")
async def lookup_user(email: str) -> Optional[UserResponse]:
    """Look up a user by email"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**user)

@router.post("/sync")
async def sync_user(user_data: UserCreate) -> UserResponse:
    """Sync user data from frontend"""
    email_lower = user_data.email.lower()
    
    # Check if user exists
    existing_user = get_user_by_email(email_lower)
    
    now = datetime.utcnow().isoformat() + "Z"
    
    if existing_user:
        # Update existing user, merge data
        existing_user.update({
            'name': user_data.name or existing_user.get('name'),
            'address': user_data.address or existing_user.get('address'),
            'phone': user_data.phone or existing_user.get('phone'),
            'company': user_data.company or existing_user.get('company'),
            'docsThisMonth': max(user_data.docsThisMonth, existing_user.get('docsThisMonth', 0)),
            'totalDocsAnalyzed': max(user_data.totalDocsAnalyzed, existing_user.get('totalDocsAnalyzed', 0)),
            'totalSavings': max(user_data.totalSavings, existing_user.get('totalSavings', 0)),
            'lastLoginAt': now,
            'isPro': user_data.isPro or existing_user.get('isPro', False)
        })
        users_db[existing_user['id']] = existing_user
        
        # Map device to user
        if user_data.deviceId:
            device_user_map[user_data.deviceId] = existing_user['id']
        
        return UserResponse(**existing_user)
    else:
        # Create new user
        new_user = {
            'id': user_data.id,
            'email': email_lower,
            'name': user_data.name,
            'isPro': user_data.isPro,
            'docsThisMonth': user_data.docsThisMonth,
            'totalDocsAnalyzed': user_data.totalDocsAnalyzed,
            'totalSavings': user_data.totalSavings,
            'address': user_data.address,
            'phone': user_data.phone,
            'company': user_data.company,
            'createdAt': user_data.createdAt or now,
            'lastLoginAt': now
        }
        users_db[new_user['id']] = new_user
        
        # Map device to user
        if user_data.deviceId:
            device_user_map[user_data.deviceId] = new_user['id']
        
        return UserResponse(**new_user)

@router.patch("/{user_id}")
async def update_user(user_id: str, updates: UserUpdate) -> UserResponse:
    """Update user profile"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    update_data = updates.dict(exclude_unset=True)
    user.update(update_data)
    users_db[user_id] = user
    
    return UserResponse(**user)

@router.delete("/{user_id}")
async def delete_user(user_id: str) -> dict:
    """Delete user account"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    del users_db[user_id]
    
    # Clean up device mappings
    device_user_map_copy = dict(device_user_map)
    for device_id, uid in device_user_map_copy.items():
        if uid == user_id:
            del device_user_map[device_id]
    
    return {"success": True, "message": "User deleted"}

@router.get("/{user_id}/stats")
async def get_user_stats(user_id: str) -> dict:
    """Get user statistics"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    return {
        "docsThisMonth": user.get('docsThisMonth', 0),
        "totalDocsAnalyzed": user.get('totalDocsAnalyzed', 0),
        "totalSavings": user.get('totalSavings', 0),
        "isPro": user.get('isPro', False),
        "remainingThisMonth": float('inf') if user.get('isPro') else max(0, 30 - user.get('docsThisMonth', 0))
    }


# Auth0 Integration
auth0_router = APIRouter(prefix="/api/auth", tags=["auth"])

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET", "")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")

class Auth0CallbackRequest(BaseModel):
    code: str
    state: str
    redirect_uri: str

class Auth0TokenResponse(BaseModel):
    user: UserResponse
    accessToken: str

@auth0_router.post("/auth0/callback")
async def auth0_callback(data: Auth0CallbackRequest) -> Auth0TokenResponse:
    """Handle Auth0 OAuth callback"""
    if not AUTH0_DOMAIN or not AUTH0_CLIENT_ID or not AUTH0_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Auth0 not configured")
    
    # Exchange code for tokens
    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, json={
            "grant_type": "authorization_code",
            "client_id": AUTH0_CLIENT_ID,
            "client_secret": AUTH0_CLIENT_SECRET,
            "code": data.code,
            "redirect_uri": data.redirect_uri
        })
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Failed to exchange code for tokens")
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        id_token = tokens.get("id_token")
        
        # Get user info from Auth0
        userinfo_response = await client.get(
            f"https://{AUTH0_DOMAIN}/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if userinfo_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Failed to get user info")
        
        userinfo = userinfo_response.json()
    
    # Create or update user
    email = userinfo.get("email", "")
    name = userinfo.get("name", userinfo.get("nickname", ""))
    picture = userinfo.get("picture", "")
    auth0_id = userinfo.get("sub", "")
    
    existing_user = get_user_by_email(email)
    now = datetime.utcnow().isoformat() + "Z"
    
    if existing_user:
        existing_user.update({
            'name': name or existing_user.get('name'),
            'picture': picture,
            'auth0Id': auth0_id,
            'lastLoginAt': now
        })
        users_db[existing_user['id']] = existing_user
        user = existing_user
    else:
        user_id = f"user_{hashlib.md5(email.encode()).hexdigest()[:12]}"
        user = {
            'id': user_id,
            'email': email.lower(),
            'name': name,
            'picture': picture,
            'auth0Id': auth0_id,
            'isPro': False,
            'docsThisMonth': 0,
            'totalDocsAnalyzed': 0,
            'totalSavings': 0,
            'createdAt': now,
            'lastLoginAt': now
        }
        users_db[user_id] = user
    
    return Auth0TokenResponse(
        user=UserResponse(**user),
        accessToken=access_token
    )

@auth0_router.post("/logout")
async def logout() -> dict:
    """Handle logout (stateless, just returns success)"""
    return {"success": True, "message": "Logged out"}

# Helper to verify JWT from Auth0 (for protected endpoints)
async def verify_auth0_token(authorization: str = Header(None)) -> Optional[dict]:
    """Verify Auth0 access token"""
    if not authorization:
        return None
    
    if not authorization.startswith("Bearer "):
        return None
    
    token = authorization[7:]
    
    # In production, verify JWT signature using Auth0 public keys
    # For now, just decode and trust (add proper verification!)
    try:
        import base64
        payload = token.split('.')[1]
        # Add padding if needed
        payload += '=' * (4 - len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        return json.loads(decoded)
    except:
        return None
