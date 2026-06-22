from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Application, Job
from app.schemas import ApplicationCreate

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/apply")
def apply_job(
    data: ApplicationCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Application).filter(
        Application.user_id == data.user_id,
        Application.job_id == data.job_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already applied for this job"
        )

    application = Application(
        user_id=data.user_id,
        job_id=data.job_id,
        status="Applied"
    )

    db.add(application)
    db.commit()

    return {
        "message": "Application submitted successfully"
    }


# ROUTE PATH FIX: Changed from "/{user_id}" to "/user/{user_id}" to fix the 404 error
@router.get("/user/{user_id}")
def get_applications(user_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(Application, Job)
        .join(Job, Application.job_id == Job.id)
        .filter(Application.user_id == user_id)
        .all()
    )

    return [
        {
            "application_id": app.id,
            "job_id": job.id,
            "title": job.title,
            "company": job.company,
            "status": app.status,
            "applied_at": getattr(app, "applied_at", "Recent") # using getattr fallback in case column name varies
        }
        for app, job in results
    ]