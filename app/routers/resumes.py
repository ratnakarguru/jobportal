import os
import uuid
import json
from io import BytesIO
from PyPDF2 import PdfReader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Resume
from app.utils import parse_resume_text

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

# ── Where resumes are stored on disk ─────────────────────────────────────────
UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {"application/pdf"}
MAX_SIZE_MB   = 5


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── POST /resume/{user_id} ────────────────────────────────────────────────────
@router.post("/{user_id}")
async def upload_resume(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Read file contents
    contents = await file.read()

    # Validate file size
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size is {MAX_SIZE_MB}MB."
        )

    # Extract text from PDF
    try:
        pdf_reader = PdfReader(BytesIO(contents))
        resume_text = ""

        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                resume_text += page_text + "\n"

        parsed_resume = parse_resume_text(resume_text)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not parse PDF: {str(e)}"
        )

    # Check if resume already exists
    existing = db.query(Resume).filter(
        Resume.user_id == user_id
    ).first()

    # Delete old file if replacing
    if (
        existing
        and existing.resume_file
        and os.path.exists(existing.resume_file)
    ):
        os.remove(existing.resume_file)

    # Generate unique filename
    ext = os.path.splitext(file.filename)[1] or ".pdf"
    filename = f"user_{user_id}_{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    # Save PDF
    with open(save_path, "wb") as f:
        f.write(contents)

    # Save database record
    if existing:
        existing.resume_file = save_path
        existing.parsed_data = parsed_resume
    else:
        new_resume = Resume(
            user_id=user_id,
            resume_file=save_path,
            parsed_data=parsed_resume
        )
        db.add(new_resume)

    db.commit()

    return {
        "message": "Resume uploaded successfully",
        "resume_file": save_path,
        "parsed_resume": parsed_resume
    }


# ── GET /resume/{user_id} ────────────────────────────────────────────────────
# This endpoint pulls the structured parsed_data out of the database JSON column
@router.get("/{user_id}")
def get_resume_json(user_id: int, db: Session = Depends(get_db)):
    resume_record = db.query(Resume).filter(Resume.user_id == user_id).first()
    
    if not resume_record:
        raise HTTPException(
            status_code=404, 
            detail="No resume found for this candidate user profile."
        )
        
    return {
        "user_id": resume_record.user_id,
        "resume_id": resume_record.id,
        "file_path": resume_record.resume_file,
        # SQLAlchemy handles Python native dict/list output automatically for JSON columns
        "parsed_data": resume_record.parsed_data if resume_record.parsed_data else {}
    }