from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
# 1. CRITICAL FIX: Imported User model alongside Job
from app.models import Job, User, Resume

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_jobs(db: Session = Depends(get_db)):
    try:
        raw_jobs = db.query(Job).all()
        formatted_jobs = []

        for job in raw_jobs:
            def text_to_list(text_field):
                if not text_field:
                    return []
                return [item.strip() for item in text_field.split(",") if item.strip()]

            if job.company:
                logo_text = job.company[0:2].upper()
            else:
                logo_text = "JB"

            formatted_jobs.append({
                "id": job.id,
                "title": job.title,
                "company": job.company or "Unknown Company",
                "location": job.location or "India",
                "type": "Full-time",  
                "salary": job.salary or "Not Disclosed",
                "experience": job.experience or "Fresher",
                "qualification": job.qualification or "Any Graduate",
                "description": job.description or "",
                "companyAbout": job.company_about or "", 
                "posted": "Recent", 
                "responsibilities": text_to_list(job.responsibilities),
                "skills": text_to_list(job.skills),
                "benefits": text_to_list(job.benefits),
                "logoText": logo_text
            })
            
        return formatted_jobs

    except Exception as e:
        print(f"Database Mapping Error: {e}")
        raise HTTPException(status_code=500, detail="Error formatting database records")


@router.get("/recommended/{user_id}")
def get_recommended_jobs(user_id: int, db: Session = Depends(get_db)):

    resume = db.query(Resume).filter(
        Resume.user_id == user_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    parsed_data = resume.parsed_data or {}

    resume_skills = [
        skill.lower()
        for skill in parsed_data.get("skills", [])
    ]

    all_jobs = db.query(Job).all()

    matched_jobs = []

    for job in all_jobs:

        job_skills = []

        if job.skills:
            job_skills = [
                skill.strip().lower()
                for skill in job.skills.split(",")
            ]

        matched_count = len(
            set(resume_skills).intersection(set(job_skills))
        )

        if matched_count > 0:

            matched_jobs.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "salary": job.salary,
                "experience": job.experience,
                "qualification": job.qualification,
                "description": job.description,
                "skills": job_skills,
                "match_count": matched_count
            })

    matched_jobs.sort(
        key=lambda x: x["match_count"],
        reverse=True
    )

    return matched_jobs

@router.get("/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "name": user.name,
            "email": user.email,
            "total_jobs": 0,
            "applications": 0,
            "interviews": 0,
        }
    except Exception as e:
        print(f"Dashboard Fetch Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching dashboard metadata")


@router.post("/apply")
def apply_job(data: ApplicationCreate, db: Session = Depends(get_db)):

    existing = db.query(Application).filter(
        Application.user_id == data.user_id,
        Application.job_id == data.job_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already applied"
        )

    application = Application(
        user_id=data.user_id,
        job_id=data.job_id,
        status="Applied"
    )

    db.add(application)
    db.commit()

    return {"message": "Application submitted"}