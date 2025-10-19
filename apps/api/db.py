from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

ENGINE = create_engine(os.getenv('DATABASE_URL', 'postgresql+psycopg://ps:ps@localhost:5432/paipersum'))
SessionLocal = sessionmaker(bind=ENGINE)

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def fetch_user_by_email(db, email):
    r = db.execute(text('select id, email, password_hash from users where email=:e'), {"e":email}).first()
    if not r: return None
    from types import SimpleNamespace
    return SimpleNamespace(id=r.id, email=r.email, password_hash=r.password_hash)

def create_user(db, email, pw_hash):
    db.execute(text('insert into users(email, password_hash) values(:e,:p)'), {"e":email, "p":pw_hash})
    db.commit()
