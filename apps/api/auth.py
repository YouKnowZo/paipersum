from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.hash import argon2
import jwt, os
from .db import get_session, fetch_user_by_email, create_user

router = APIRouter(prefix="/auth", tags=["auth"])
JWT_SECRET = os.getenv('JWT_SECRET','change_me')

class Creds(BaseModel):
    email: str
    password: str

@router.post('/register')
def register(c: Creds, db=Depends(get_session)):
    if fetch_user_by_email(db, c.email):
        raise HTTPException(400, 'Email exists')
    create_user(db, c.email, argon2.hash(c.password))
    return {"ok": True}

@router.post('/login')
def login(c: Creds, db=Depends(get_session)):
    u = fetch_user_by_email(db, c.email)
    if not u or not argon2.verify(c.password, u.password_hash):
        raise HTTPException(401, 'Invalid credentials')
    token = jwt.encode({"sub": str(u.id)}, JWT_SECRET, algorithm="HS256")
    return {"token": token}
