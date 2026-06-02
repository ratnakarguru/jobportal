from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Profile
from app.schemas import ProfileCreate

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{user_id}")
def create_profile(
    user_id: int,
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):

    new_profile = Profile(
        user_id=user_id,
        skills=profile.skills,
        education=profile.education,
        experience=profile.experience,
        location=profile.location,
        phone=profile.phone
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "message": "Profile saved successfully",
        "profile_id": new_profile.id
    }


@router.get("/{user_id}")
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    return profile


@router.put("/{user_id}")
def update_profile(
    user_id: int,
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):
    existing_profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    existing_profile.skills = profile.skills
    existing_profile.education = profile.education
    existing_profile.experience = profile.experience
    existing_profile.location = profile.location
    existing_profile.phone = profile.phone

    db.commit()
    db.refresh(existing_profile)

    return {
        "message": "Profile updated successfully"
    }