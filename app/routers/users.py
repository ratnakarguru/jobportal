from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from pwdlib import PasswordHash

from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate, UserResponse


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ============================================================
# PASSWORD HASHING
# ============================================================

password_hash = PasswordHash.recommended()


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# CREATE USER
# POST /users/
# ============================================================

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Check whether email already exists
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # --------------------------------------------------------
    # Hash password
    # --------------------------------------------------------

    hashed_password = password_hash.hash(
        user.password
    )

    # --------------------------------------------------------
    # Create database user
    # --------------------------------------------------------

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    # --------------------------------------------------------
    # Save user
    # --------------------------------------------------------

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ============================================================
# GET ALL USERS
# GET /users/
# ============================================================

@router.get(
    "/",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users


# ============================================================
# GET USER BY ID
# GET /users/{user_id}
# ============================================================

@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user