from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Role, Profile, Resume

router = APIRouter(
    prefix="/onboarding",
    tags=["Onboarding"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/status/{user_id}")
def onboarding_status(
    user_id: int,
    db: Session = Depends(get_db)
):

    role = db.query(Role).filter(
        Role.user_id == user_id
    ).first()

    profile = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    resume = db.query(Resume).filter(
        Resume.user_id == user_id
    ).first()

    return {
        "role_completed": role is not None,
        "profile_completed": profile is not None,
        "resume_completed": resume is not None
    }