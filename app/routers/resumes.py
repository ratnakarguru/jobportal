import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Resume

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
    # 1. Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 2. Validate file size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File too large. Max size is {MAX_SIZE_MB}MB.")

    # 3. Check if resume row already exists for this user
    existing = db.query(Resume).filter(Resume.user_id == user_id).first()

    # 4. Delete old file from disk if replacing
    if existing and existing.resume_file and os.path.exists(existing.resume_file):
        os.remove(existing.resume_file)

    # 5. Save new file with unique name
    ext       = os.path.splitext(file.filename)[1] or ".pdf"
    filename  = f"user_{user_id}_{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    with open(save_path, "wb") as f:
        f.write(contents)

    # 6. Update existing row or create new one
    if existing:
        existing.resume_file = save_path
    else:
        db.add(Resume(user_id=user_id, resume_file=save_path))

    db.commit()

    return {"message": "Resume uploaded successfully", "resume_file": save_path}


# ── GET /resume/{user_id} ─────────────────────────────────────────────────────

@router.get("/{user_id}")
def get_resume(
    user_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Resume).filter(Resume.user_id == user_id).first()

    if not record or not record.resume_file:
        raise HTTPException(status_code=404, detail="No resume found for this user.")

    if not os.path.exists(record.resume_file):
        raise HTTPException(status_code=404, detail="Resume file missing from server.")

    return FileResponse(
        path       = record.resume_file,
        media_type = "application/pdf",
        filename   = f"resume_user_{user_id}.pdf"
    )


# ── DELETE /resume/{user_id} ──────────────────────────────────────────────────

@router.delete("/{user_id}")
def delete_resume(
    user_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Resume).filter(Resume.user_id == user_id).first()

    if not record or not record.resume_file:
        raise HTTPException(status_code=404, detail="No resume found.")

    if os.path.exists(record.resume_file):
        os.remove(record.resume_file)

    record.resume_file = None
    db.commit()

    return {"message": "Resume deleted successfully"}