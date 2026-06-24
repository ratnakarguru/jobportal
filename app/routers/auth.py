from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate, Login
from app.utils import hash_password, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Request schema definitions matching your premium profile form properties
class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    bio: Optional[str] = ""
    profile_photo: Optional[str] = ""
    company_name: Optional[str] = ""
    job_title: Optional[str] = ""
    education_school: Optional[str] = ""
    education_degree: Optional[str] = ""


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Register API
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# Login API
@router.post("/login")
def login(user: Login, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }


# Dynamic Fetch Profile API (Used by your Navbar Layout)
@router.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )
        
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": getattr(user, "phone", ""),
        "bio": getattr(user, "bio", ""),
        "profile_photo": getattr(user, "profile_photo", ""),
        "company_name": getattr(user, "company_name", ""),
        "job_title": getattr(user, "job_title", ""),
        "education_school": getattr(user, "education_school", ""),
        "education_degree": getattr(user, "education_degree", "")
    }


# Profile Update API (NEW: Matches your frontend Profile.jsx save operations!)
@router.put("/user/update/{user_id}")
def update_user_profile(user_id: int, profile_data: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Make sure we don't duplicate emails across accounts when updating fields
    email_check = db.query(User).filter(User.email == profile_data.email, User.id != user_id).first()
    if email_check:
        raise HTTPException(
            status_code=400,
            detail="Email address is already in use by another user profile."
        )

    # Dynamic column synchronization updates matching active inputs
    user.name = profile_data.name
    user.email = profile_data.email
    user.phone = profile_data.phone
    user.bio = profile_data.bio
    user.profile_photo = profile_data.profile_photo
    user.company_name = profile_data.company_name
    user.job_title = profile_data.job_title
    user.education_school = profile_data.education_school
    user.education_degree = profile_data.education_degree

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }