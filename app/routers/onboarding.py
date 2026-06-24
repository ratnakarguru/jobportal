from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import SessionLocal
from app.models import Role, Profile, Resume

router = APIRouter(
    prefix="/onboarding",
    tags=["Onboarding"]
)

# Optional but recommended: Pydantic response schema to enforce contract parameters
class OnboardingStatusResponse(BaseModel):
    role_completed: bool
    profile_completed: bool
    resume_completed: bool

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/status/{user_id}", response_model=OnboardingStatusResponse)
def onboarding_status(user_id: int, db: Session = Depends(get_db)):
    try:
        role = db.query(Role).filter(Role.user_id == user_id).first()
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        resume = db.query(Resume).filter(Resume.user_id == user_id).first()

        return {
            "role_completed": role is not None,
            "profile_completed": profile is not None,
            "resume_completed": resume is not None
        }
    except Exception as e:
        print(f"Onboarding verification engine failure: {e}")
        raise HTTPException(status_code=500, detail="Internal server state indexing error")