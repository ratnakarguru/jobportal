from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User

from app.schemas import UserCreate, Login
from app.utils import hash_password, verify_password
from fastapi import HTTPException

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

#Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#Register API
@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }



#Login API
@router.post("/login")
def login(
    user: Login,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
    status_code=401,
    detail="Invalid email or password"
    )

    if not verify_password(
        user.password,
        existing_user.password
    ):
        return {
            "message": "Wrong password"
        }

    return {
        "message": "Login successful",
        "user_id": existing_user.id
    }

