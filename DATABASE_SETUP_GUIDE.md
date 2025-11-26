# 🗄️ PostgreSQL Database Setup Guide for PaiperSum

Complete guide to setting up persistent database storage for user accounts, analysis history, and subscriptions.

---

## Why You Need a Database

**Current Problem**: Everything is stored in localStorage
- ❌ Data lost when browser clears cache
- ❌ Can't access from different devices
- ❌ No user sync across browsers
- ❌ Can't track subscription status
- ❌ Can't build features that require persistent data

**With Database**:
- ✅ Users keep their data forever
- ✅ Access from any device
- ✅ Track subscription status
- ✅ Store analysis history
- ✅ Build advanced features

---

## Option 1: Railway PostgreSQL (Recommended - Easiest)

### Why Railway?
- ✅ FREE $5 credit monthly (enough for small projects)
- ✅ Automatic backups
- ✅ One-click PostgreSQL deployment
- ✅ Dashboard for debugging
- ✅ Auto-scales when you grow

### Setup Steps:

1. **Create Railway Account**
   - Go to [https://railway.app](https://railway.app)
   - Sign up with GitHub (free)

2. **Create New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Railway will create a database in ~30 seconds

3. **Get Connection String**
   - Click on your PostgreSQL service
   - Go to "Connect" tab
   - Copy the **Postgres Connection URL**
   - It looks like: `postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway`

4. **Add to Environment Variables**
   
   **Backend (.env or Railway env vars)**:
   ```bash
   DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
   ```

   **Frontend (.env.local)**:
   ```bash
   VITE_API_URL=https://your-backend.railway.app
   ```

### Cost:
- **Free Tier**: $5/month credit (covers ~1,000 users)
- **Hobby**: $5/month after credit used
- **Pro**: $20/month (scales to 10,000+ users)

---

## Option 2: Supabase (Great Alternative)

### Why Supabase?
- ✅ PostgreSQL + Auth + Storage in one
- ✅ FREE tier up to 500MB database
- ✅ Built-in Auth (alternative to Auth0)
- ✅ Real-time subscriptions
- ✅ Generous free tier

### Setup Steps:

1. **Create Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up (free)

2. **Create Project**
   - Click "New Project"
   - Choose organization (create new if first time)
   - Set database password (save this!)
   - Choose region (closest to your users)
   - Wait 2-3 minutes for provisioning

3. **Get Connection Details**
   - Go to Settings → Database
   - Copy **Connection String** (URI)
   - Copy **anon public key** (for frontend)

4. **Environment Variables**
   
   **Backend**:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Frontend**:
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Cost:
- **Free Tier**: 500MB database, 2GB bandwidth
- **Pro**: $25/month (8GB database, 250GB bandwidth)
- **Team**: $599/month (unlimited)

---

## Option 3: Neon (Serverless PostgreSQL)

### Why Neon?
- ✅ Serverless (auto-scales to zero)
- ✅ Generous free tier
- ✅ Branch databases (like git branches!)
- ✅ Fast cold starts

### Setup:
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up (free)
3. Create project
4. Copy connection string
5. Add to `DATABASE_URL`

### Cost:
- **Free Tier**: 3GB storage, 0.5GB compute
- **Pro**: $19/month (starts at 10GB)

---

## Database Schema Setup

### Step 1: Install Database Dependencies

**For Python Backend**:
```bash
cd apps/api
pip install sqlalchemy psycopg2-binary alembic
```

**Update requirements.txt**:
```txt
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.0
```

### Step 2: Create Database Models

Create `apps/api/models.py`:

```python
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    auth0_id = Column(String, unique=True, index=True)
    
    # Profile
    phone = Column(String)
    address = Column(String)
    company = Column(String)
    
    # Subscription
    is_pro = Column(Boolean, default=False)
    stripe_customer_id = Column(String, unique=True)
    stripe_subscription_id = Column(String)
    subscription_status = Column(String)  # active, canceled, past_due
    
    # Usage
    docs_this_month = Column(Integer, default=0)
    total_docs_analyzed = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    analyses = relationship("Analysis", back_populates="user")


class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Document info
    document_name = Column(String)
    document_type = Column(String)  # gym_membership, lease, etc.
    
    # Analysis results
    risk_score = Column(Integer)
    confidence = Column(Float)
    recommendation = Column(String)  # sign, negotiate, walk_away
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
```

### Step 3: Create Database Connection

Create `apps/api/database.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,         # Connection pool size
    max_overflow=10      # Max connections beyond pool_size
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency for FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 4: Initialize Database

Create `apps/api/init_db.py`:

```python
from models import Base
from database import engine

def init_db():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized!")

if __name__ == "__main__":
    init_db()
```

Run it:
```bash
cd apps/api
python init_db.py
```

---

## API Endpoints for User Management

Add to `apps/api/main.py`:

```python
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Analysis
from typing import Optional

# Get current user
@app.get("/api/users/me")
async def get_current_user(
    token: str = Depends(verify_token),  # Auth0 verification
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    user = db.query(User).filter(User.auth0_id == token['sub']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Create user
@app.post("/api/users")
async def create_user(
    token: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create new user from Auth0 token"""
    existing = db.query(User).filter(User.auth0_id == token['sub']).first()
    if existing:
        return existing
    
    user = User(
        auth0_id=token['sub'],
        email=token.get('email'),
        name=token.get('name') or token.get('email').split('@')[0]
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Update user
@app.patch("/api/users/me")
async def update_user(
    updates: dict,
    token: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user = db.query(User).filter(User.auth0_id == token['sub']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in updates.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

# Save analysis
@app.post("/api/analyses")
async def save_analysis(
    document_name: str,
    risk_score: int,
    recommendation: str,
    token: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Save analysis to user's history"""
    user = db.query(User).filter(User.auth0_id == token['sub']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    analysis = Analysis(
        user_id=user.id,
        document_name=document_name,
        risk_score=risk_score,
        recommendation=recommendation
    )
    
    # Update user stats
    user.docs_this_month += 1
    user.total_docs_analyzed += 1
    
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

# Get user's analysis history
@app.get("/api/analyses")
async def get_analyses(
    limit: int = 10,
    token: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get user's analysis history"""
    user = db.query(User).filter(User.auth0_id == token['sub']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    analyses = db.query(Analysis)\
        .filter(Analysis.user_id == user.id)\
        .order_by(Analysis.created_at.desc())\
        .limit(limit)\
        .all()
    
    return analyses
```

---

## Database Migrations (Optional but Recommended)

### Initialize Alembic
```bash
cd apps/api
alembic init migrations
```

### Configure Alembic

Edit `alembic.ini`:
```ini
sqlalchemy.url = %(DATABASE_URL)s
```

Edit `migrations/env.py`:
```python
from models import Base
target_metadata = Base.metadata
```

### Create First Migration
```bash
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

### Future Schema Changes
```bash
# After changing models.py:
alembic revision --autogenerate -m "Add new column"
alembic upgrade head
```

---

## Testing Your Database

### Test Connection
```python
# test_db.py
from database import engine

try:
    connection = engine.connect()
    print("✅ Database connection successful!")
    connection.close()
except Exception as e:
    print(f"❌ Database connection failed: {e}")
```

Run it:
```bash
python test_db.py
```

### Test User Creation
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Backup Strategy

### Railway Backups (Automatic)
- Railway backs up your database daily
- Restore from dashboard: Database → Backups

### Manual Backup
```bash
# Get connection string from Railway/Supabase
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Automated Backups (Production)
Set up daily backups with cron job:
```bash
# backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://paipersum-backups/
```

---

## Security Best Practices

### ✅ DO:
- Use environment variables for connection strings
- Enable SSL connections in production
- Use connection pooling
- Set up read replicas for scaling
- Monitor query performance
- Enable slow query logs

### ❌ DON'T:
- Don't commit connection strings to git
- Don't expose database publicly
- Don't use default passwords
- Don't skip indexes on frequently queried columns
- Don't store sensitive data unencrypted

---

## Cost Optimization

### Development (FREE)
- Railway: $5 credit/month
- Supabase: 500MB free
- Neon: 3GB free

### Production (Small - 1,000 users)
- Railway: $5-10/month
- Supabase: Free tier covers it
- Neon: Free tier covers it

### Production (Medium - 10,000 users)
- Railway: $20-30/month
- Supabase: $25/month (Pro tier)
- Neon: $19/month

### Production (Large - 100,000+ users)
- AWS RDS: $100-500/month
- Google Cloud SQL: $150-600/month
- Self-managed: $50-200/month + DevOps time

---

## Troubleshooting

### "Connection refused"
**Solution**: Check firewall rules, ensure database is running

### "SSL required"
**Solution**: Add `?sslmode=require` to connection string

### "Too many connections"
**Solution**: Increase connection pool size or upgrade plan

### "Slow queries"
**Solution**: Add indexes, optimize queries, use EXPLAIN ANALYZE

---

## Next Steps After Database Setup

1. ✅ Users now persist across sessions
2. ✅ Analysis history is saved
3. ✅ Ready for subscription tracking
4. 🔄 Next: Integrate Stripe payments (see STRIPE_SETUP_GUIDE.md)
5. 🔄 Next: Deploy backend with database connection

---

## Quick Reference

### Railway Dashboard
- **URL**: https://railway.app/dashboard
- **Docs**: https://docs.railway.app

### Connection String Format
```
postgresql://username:password@host:port/database
```

### Common Commands
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# List tables
psql $DATABASE_URL -c "\dt"

# Count users
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users"
```

---

**Setup Time**: 20-45 minutes  
**Difficulty**: Moderate  
**Cost**: FREE (initially)  
**Required For**: Production deployment

Your data will finally persist! 🎉
