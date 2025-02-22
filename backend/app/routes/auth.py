from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional
from app import database, models, schemas

router = APIRouter(prefix="/auth", tags=["auth"])

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = password_context.hash(user.password)
    db_user = models.User(name=user.name, email=user.email, password=hashed_password, bio="", profile_image="")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not password_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"message": "Login successful", "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email}}

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    password: Optional[str] = None

@router.put("/update-profile/{user_id}")
def update_profile(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_data.name:
        user.name = user_data.name
    if user_data.bio:
        user.bio = user_data.bio
    if user_data.profile_image:
        user.profile_image = user_data.profile_image
    if user_data.password:
        user.password = password_context.hash(user_data.password)
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully", "user": user}