from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Role
from app.schemas import RoleCreate

router = APIRouter(
    prefix="/select-role",
    tags=["Roles"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{user_id}")
def create_role(
    user_id: int,
    role: RoleCreate,
    db: Session = Depends(get_db)
):
    new_role = Role(
        user_id=user_id,
        role_name=role.role_name
    )

    db.add(new_role)
    db.commit()
    db.refresh(new_role) # <-- Add this line

    return {"message": "Role saved", "role_id": new_role.id}