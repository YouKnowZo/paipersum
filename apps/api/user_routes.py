"""
User management API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from database import get_db
from models import User, Analysis
from auth import verify_token, verify_token_optional

router = APIRouter(prefix="/api/users", tags=["users"])


# Pydantic models for request/response
class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    email_notifications: Optional[bool] = None
    marketing_emails: Optional[bool] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str]
    address: Optional[str]
    company: Optional[str]
    picture: Optional[str]
    isPro: bool
    docsThisMonth: int
    totalDocsAnalyzed: int
    totalSavings: int
    subscriptionStatus: Optional[str]
    stripeCustomerId: Optional[str]
    createdAt: Optional[str]


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return user.to_dict()


@router.post("/", response_model=UserResponse)
async def create_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create a new user from Auth0 token"""
    auth0_id = token.get("sub")
    email = token.get("email")
    name = token.get("name") or email.split("@")[0]
    email_verified = token.get("email_verified", False)
    picture = token.get("picture")
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.auth0_id == auth0_id).first()
    if existing_user:
        return existing_user.to_dict()
    
    # Create new user
    user = User(
        auth0_id=auth0_id,
        email=email,
        name=name,
        email_verified=email_verified,
        picture=picture,
        last_login=datetime.utcnow()
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print(f"✅ Created new user: {email}")
    
    return user.to_dict()


@router.patch("/me", response_model=UserResponse)
async def update_user(
    updates: UserUpdate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update only provided fields
    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(user)
    
    return user.to_dict()


@router.delete("/me")
async def delete_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete current user's account (GDPR compliance)"""
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Delete user (cascade deletes analyses)
    db.delete(user)
    db.commit()
    
    print(f"🗑️  Deleted user: {user.email}")
    
    return {"message": "Account deleted successfully"}


@router.get("/me/stats")
async def get_user_stats(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get user's usage statistics"""
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get analysis history
    analyses = db.query(Analysis)\
        .filter(Analysis.user_id == user.id)\
        .order_by(Analysis.created_at.desc())\
        .all()
    
    # Calculate stats
    total_analyses = len(analyses)
    high_risk_docs = sum(1 for a in analyses if a.risk_score and a.risk_score >= 70)
    medium_risk_docs = sum(1 for a in analyses if a.risk_score and 40 <= a.risk_score < 70)
    low_risk_docs = sum(1 for a in analyses if a.risk_score and a.risk_score < 40)
    
    return {
        "totalAnalyses": total_analyses,
        "docsThisMonth": user.docs_this_month,
        "totalSavings": user.total_savings,
        "highRiskDocs": high_risk_docs,
        "mediumRiskDocs": medium_risk_docs,
        "lowRiskDocs": low_risk_docs,
        "isPro": user.is_pro,
        "subscriptionStatus": user.subscription_status,
        "memberSince": user.created_at.isoformat() if user.created_at else None,
    }


@router.get("/me/analyses", response_model=List[dict])
async def get_user_analyses(
    limit: int = 10,
    offset: int = 0,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get user's analysis history"""
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    analyses = db.query(Analysis)\
        .filter(Analysis.user_id == user.id)\
        .order_by(Analysis.created_at.desc())\
        .limit(limit)\
        .offset(offset)\
        .all()
    
    return [analysis.to_dict() for analysis in analyses]


@router.post("/me/analyses")
async def save_analysis(
    document_name: str,
    document_type: str,
    risk_score: int,
    confidence: float,
    recommendation: str,
    clauses_detected: List[dict],
    cost_impact: Optional[int] = None,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Save an analysis to user's history"""
    import json
    
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create analysis
    analysis = Analysis(
        user_id=user.id,
        document_name=document_name,
        document_type=document_type,
        risk_score=risk_score,
        confidence=confidence,
        recommendation=recommendation,
        clauses_detected=json.dumps(clauses_detected),
        cost_impact=cost_impact or 0,
    )
    
    # Update user stats
    user.docs_this_month += 1
    user.total_docs_analyzed += 1
    if cost_impact:
        user.total_savings += cost_impact
    
    user.updated_at = datetime.utcnow()
    
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return analysis.to_dict()


@router.delete("/me/analyses/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete a specific analysis"""
    auth0_id = token.get("sub")
    
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    analysis = db.query(Analysis)\
        .filter(Analysis.id == analysis_id, Analysis.user_id == user.id)\
        .first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    db.delete(analysis)
    db.commit()
    
    return {"message": "Analysis deleted successfully"}
