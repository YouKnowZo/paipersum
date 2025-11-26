"""
SQLAlchemy models for PaiperSum database
"""
from sqlalchemy import Column, String, Boolean, Integer, DateTime, Float, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    """User model with authentication and subscription info"""
    __tablename__ = "users"
    
    # Primary key
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Authentication
    auth0_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    email_verified = Column(Boolean, default=False)
    
    # Profile
    name = Column(String, nullable=False)
    phone = Column(String)
    address = Column(String)
    company = Column(String)
    picture = Column(String)  # Profile picture URL
    
    # Subscription & Billing
    is_pro = Column(Boolean, default=False)
    stripe_customer_id = Column(String, unique=True)
    stripe_subscription_id = Column(String)
    subscription_status = Column(String)  # active, canceled, past_due, trialing
    subscription_period = Column(String)  # monthly, yearly
    trial_ends_at = Column(DateTime)
    subscription_ends_at = Column(DateTime)
    
    # Usage tracking
    docs_this_month = Column(Integer, default=0)
    total_docs_analyzed = Column(Integer, default=0)
    total_savings = Column(Integer, default=0)  # Dollars saved
    
    # Preferences
    email_notifications = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime)
    
    # Relationships
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, is_pro={self.is_pro})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "phone": self.phone,
            "address": self.address,
            "company": self.company,
            "picture": self.picture,
            "isPro": self.is_pro,
            "docsThisMonth": self.docs_this_month,
            "totalDocsAnalyzed": self.total_docs_analyzed,
            "totalSavings": self.total_savings,
            "subscriptionStatus": self.subscription_status,
            "stripeCustomerId": self.stripe_customer_id,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Analysis(Base):
    """Analysis history for each user"""
    __tablename__ = "analyses"
    
    # Primary key
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Foreign key
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Document info
    document_name = Column(String)
    document_type = Column(String)  # gym_membership, lease, phone_contract, software_tos, general
    document_text = Column(Text)  # Store original text (optional, for re-analysis)
    
    # Analysis results
    risk_score = Column(Integer)
    confidence = Column(Float)
    recommendation = Column(String)  # sign, negotiate, walk_away
    
    # Detailed results (stored as JSON string)
    clauses_detected = Column(Text)  # JSON array of clauses
    cost_impact = Column(Integer)  # Potential cost/savings
    
    # Metadata
    file_size = Column(Integer)  # Original file size in bytes
    processing_time = Column(Float)  # Time taken to analyze (seconds)
    ip_address = Column(String)  # For security/fraud detection
    user_agent = Column(String)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    
    def __repr__(self):
        return f"<Analysis(id={self.id}, user_id={self.user_id}, risk_score={self.risk_score})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        import json
        return {
            "id": self.id,
            "documentName": self.document_name,
            "documentType": self.document_type,
            "riskScore": self.risk_score,
            "confidence": self.confidence,
            "recommendation": self.recommendation,
            "clausesDetected": json.loads(self.clauses_detected) if self.clauses_detected else [],
            "costImpact": self.cost_impact,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class ApiKey(Base):
    """API keys for programmatic access (future feature)"""
    __tablename__ = "api_keys"
    
    # Primary key
    id = Column(String, primary_key=True, default=generate_uuid)
    
    # Foreign key
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Key info
    key_hash = Column(String, unique=True, nullable=False)  # Never store plain key
    key_prefix = Column(String)  # e.g., "ps_live_" for display
    name = Column(String)  # User-friendly name
    
    # Permissions
    scopes = Column(String)  # Comma-separated: "read,write,analyze"
    
    # Usage tracking
    requests_made = Column(Integer, default=0)
    last_used = Column(DateTime)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime)
    
    def __repr__(self):
        return f"<ApiKey(id={self.id}, user_id={self.user_id}, name={self.name})>"


class Waitlist(Base):
    """Email waitlist for launch"""
    __tablename__ = "waitlist"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String)
    referral_source = Column(String)  # How they found us
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    invited_at = Column(DateTime)
    
    def __repr__(self):
        return f"<Waitlist(email={self.email})>"
