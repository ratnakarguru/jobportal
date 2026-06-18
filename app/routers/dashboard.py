from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User, Job, Application

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    total_jobs = db.query(Job).count()

    applications = db.query(Application).filter(
        Application.user_id == user_id
    ).count()

    interviews = db.query(Application).filter(
        Application.user_id == user_id,
        Application.status == "Interview"
    ).count()

    return {
        "name": user.name,
        "email": user.email,
        "total_jobs": total_jobs,
        "applications": applications,
        "interviews": interviews
    }