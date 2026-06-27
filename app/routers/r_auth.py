from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db 
from app.models import Role, User
from app.utils import verify_password  # Ensure you import your password utility

router = APIRouter(
    prefix="/auth",  # Optional: Groups it with your auth paths
    tags=["Recruiter Authentication & Management"]
)

# ── REQUEST SCHEMAS ──
class RoleSelection(BaseModel):
    role_name: str  # Will receive "recruiter" or "candidate"

class RecruiterLoginPayload(BaseModel):
    email: EmailStr
    password: str


# ── EXISTING ROLE ASSIGNMENT ENDPOINT ──
@router.post("/select-role/{user_id}")
def assign_user_role(user_id: int, role_data: RoleSelection, db: Session = Depends(get_db)):
    # Verify user exists first
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User target not found in records.")

    # Check if a role is already mapped to prevent duplicates
    existing_role = db.query(Role).filter(Role.user_id == user_id).first()
    if existing_role:
        existing_role.role_name = role_data.role_name
        db.commit()
        return {"message": "User role updated successfully", "role": existing_role.role_name}

    # Initialize and attach the fresh corporate/jobseeker identity
    new_role = Role(
        user_id=user_id,
        role_name=role_data.role_name
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    return {
        "message": "Role configured successfully",
        "role": new_role.role_name
    }


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