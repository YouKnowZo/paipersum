"""
Database connection and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
import os

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./paipersum.db")

# Fix for Heroku/Render postgres URLs (postgres:// -> postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"📊 Connecting to database: {DATABASE_URL[:20]}...")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Verify connections before using
    pool_size=5,             # Connection pool size
    max_overflow=10,         # Max connections beyond pool_size
    pool_recycle=3600,       # Recycle connections after 1 hour
    echo=False,              # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Dependency for FastAPI endpoints to get database session
    
    Usage:
        @app.get("/users/me")
        def get_user(db: Session = Depends(get_db)):
            user = db.query(User).filter(User.id == user_id).first()
            return user
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context():
    """
    Context manager for database sessions
    
    Usage:
        with get_db_context() as db:
            user = db.query(User).first()
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """Initialize database (create all tables)"""
    from models import Base
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created!")


def reset_db():
    """Drop all tables and recreate (CAUTION: destroys all data!)"""
    from models import Base
    print("⚠️  Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database reset complete!")


if __name__ == "__main__":
    # Test database connection
    try:
        connection = engine.connect()
        print("✅ Database connection successful!")
        connection.close()
        
        # Initialize tables
        init_db()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n💡 Make sure DATABASE_URL is set correctly in .env")
        print("Example: DATABASE_URL=postgresql://user:pass@localhost:5432/dbname")
