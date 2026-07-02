from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db 
from app.models import User, Profile 
from app.utils import hash_password, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Split Portal Authentication Engine"]
)

# ── REQUEST & VALIDATION SCHEMAS ──
class AuthPayload(BaseModel):
    email: EmailStr
    password: str

class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str


@router.post("/candidate/register")
def register_candidate(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email address is already registered.")

    new_candidate = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password)
    )
    db.add(new_candidate)
    db.commit()
    return {"message": "Candidate account compiled successfully."}

# ── DEDICATED RECRUITER PORTAL AUTHENTICATION API ──
@router.post("/recruiter/login")
def recruiter_portal_login(payload: RecruiterLoginPayload, db: Session = Depends(get_db)):
    # 1. Lookup the corporate account credentials
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Invalid corporate credentials."
        )

    # 2. Check and challenge the hashed password profile parameters
    if not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=401, 
            detail="Invalid corporate credentials."
        )

    # 3. CRITICAL ENFORCEMENT GUARD: Verify that this account is explicitly tied to the recruiter role
    role_record = db.query(Role).filter(Role.user_id == user.id).first()
    if not role_record or role_record.role_name != "recruiter":
        raise HTTPException(
            status_code=403, 
            detail="Access Denied: This authentication panel is explicitly restricted to corporate recruiter profiles."
        )

    # 4. Auth success: Return secure baseline parameters back down to your React frontend context
    return {
        "message": "Recruiter console entry handshake authorized.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": role_record.role_name
        }
    }