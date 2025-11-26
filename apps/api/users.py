from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
import os
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

# In-memory store (replace with database in production)
users_db = {}

class UserCreate(BaseModel):
    email: str
    name: str
    auth0_id: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    is_pro: Optional[bool] = None

class UserResponse(BaseModel):
    email: str
    name: str
    is_pro: bool
    docs_this_month: int
    address: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    auth0_id: str
    created_at: str
    updated_at: str

def get_user_id_from_token(authorization: str = Header(None)) -> str:
    """Extract user ID from Auth0 token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    # In production, validate JWT token here
    # For now, extract from header (simplified)
    token = authorization.replace("Bearer ", "")
    
    # TODO: Validate JWT and extract 'sub' claim
    # For MVP, we'll use a simple mapping or extract from token
    # This is a placeholder - implement proper JWT validation
    return token[:32]  # Simplified for MVP

@router.post("/", response_model=UserResponse)
async def create_user(user_data: UserCreate):
    """Create or get user by Auth0 ID"""
    auth0_id = user_data.auth0_id
    
    if auth0_id in users_db:
        # User exists, return it
        user = users_db[auth0_id]
        return UserResponse(**user)
    
    # Create new user
    now = datetime.utcnow().isoformat()
    new_user = {
        "email": user_data.email,
        "name": user_data.name,
        "auth0_id": auth0_id,
        "is_pro": False,
        "docs_this_month": 0,
        "address": None,
        "phone": None,
        "company": None,
        "created_at": now,
        "updated_at": now
    }
    
    users_db[auth0_id] = new_user
    return UserResponse(**new_user)

@router.get("/me", response_model=UserResponse)
async def get_current_user(auth0_id: str = Depends(get_user_id_from_token)):
    """Get current user by Auth0 ID"""
    if auth0_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**users_db[auth0_id])

@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    auth0_id: str = Depends(get_user_id_from_token)
):
    """Update current user"""
    if auth0_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[auth0_id]
    
    # Update fields
    if user_update.name is not None:
        user["name"] = user_update.name
    if user_update.address is not None:
        user["address"] = user_update.address
    if user_update.phone is not None:
        user["phone"] = user_update.phone
    if user_update.company is not None:
        user["company"] = user_update.company
    if user_update.is_pro is not None:
        user["is_pro"] = user_update.is_pro
    
    user["updated_at"] = datetime.utcnow().isoformat()
    
    return UserResponse(**user)

@router.post("/me/increment-usage")
async def increment_usage(auth0_id: str = Depends(get_user_id_from_token)):
    """Increment document count for current user"""
    if auth0_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[auth0_id]
    user["docs_this_month"] = user.get("docs_this_month", 0) + 1
    user["updated_at"] = datetime.utcnow().isoformat()
    
    return {"docs_this_month": user["docs_this_month"]}

@router.get("/me/stats")
async def get_user_stats(auth0_id: str = Depends(get_user_id_from_token)):
    """Get user statistics"""
    if auth0_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[auth0_id]
    
    # Get from localStorage equivalent (in production, store in DB)
    # For now, return user data
    return {
        "docs_this_month": user.get("docs_this_month", 0),
        "is_pro": user.get("is_pro", False),
        "total_docs": user.get("total_docs", 0),  # Would be from DB
        "total_savings": user.get("total_savings", 0)  # Would be from DB
    }
