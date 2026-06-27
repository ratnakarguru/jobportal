from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.database import SessionLocal
from app.models import User, Profile  # 💡 Imported Profile model
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


# Dynamic Fetch Profile API (Used by your Navbar Layout — Pulls from User AND Profile tables)
@router.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )
    
    # 💡 Fetch the profile row linked to this user from job_profiles table
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        # Pull parameters safely from the associated profile row if it exists
        "phone": getattr(profile, "phone", "") if profile else "",
        "bio": getattr(profile, "about_role", "") if profile else "",  # maps to your column 'about_role'
        "profile_photo": getattr(profile, "profile_photo", "") if profile else "",
        "company_name": getattr(profile, "company_name", "") if profile else "",
        "job_title": getattr(profile, "designation", "") if profile else "",  # maps to your column 'designation'
        "education_school": getattr(profile, "education_school", "") if profile else "",
        "education_degree": getattr(profile, "education_degree", "") if profile else ""
    }


# Profile Update API (Updates both User and Profile tables safely)
@router.put("/user/update/{user_id}")
def update_user_profile(user_id: int, profile_data: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Prevent email duplication across separate identity rows
    email_check = db.query(User).filter(User.email == profile_data.email, User.id != user_id).first()
    if email_check:
        raise HTTPException(
            status_code=400,
            detail="Email address is already in use by another user profile."
        )

    # 1. Update Core User Registration details
    user.name = profile_data.name
    user.email = profile_data.email

    # 2. Look up or initialize the associated Profile table entry
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    if not profile:
        # If no profile row exists yet, create one on the fly
        profile = Profile(user_id=user_id)
        db.add(profile)

    # 3. Synchronize incoming inputs with correct profile table columns
    profile.full_name = profile_data.name
    profile.phone = profile_data.phone
    profile.about_role = profile_data.bio         # Mapped to 'about_role' in models.py
    profile.profile_photo = profile_data.profile_photo
    profile.company_name = profile_data.company_name
    profile.designation = profile_data.job_title    # Mapped to 'designation' in models.py

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