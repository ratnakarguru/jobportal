from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Company, Job

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Get all companies
@router.get("/")
def get_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).all()

    return [
        {
            "id": company.id,
            "company_name": company.company_name,
            "company_about": company.company_about,
            "status": company.status
        }
        for company in companies
    ]


# Get single company
@router.get("/{company_id}")
def get_company(company_id: int, db: Session = Depends(get_db)):

    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    return {
        "id": company.id,
        "company_name": company.company_name,
        "company_about": company.company_about,
        "status": company.status
    }


# Get jobs of a company
@router.get("/{company_id}/jobs")
def get_company_jobs(
    company_id: int,
    db: Session = Depends(get_db)
):

    jobs = db.query(Job).filter(
        Job.company_id == company_id
    ).all()

    return [
        {
            "id": job.id,
            "title": job.title,
            "location": job.location,
            "salary": job.salary,
            "experience": job.experience,
            "qualification": job.qualification,
            "status": job.status
        }
        for job in jobs
    ]