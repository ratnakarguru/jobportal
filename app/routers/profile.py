from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Profile, EducationHistory
from app.schemas import ProfileCreate, ProfileResponse

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _build_education(profile_id: int, edu_list) -> list[EducationHistory]:
    """Convert a list of EducationHistoryCreate → EducationHistory ORM objects."""
    return [
        EducationHistory(
            profile_id      = profile_id,
            college_name    = edu.college_name,
            location        = edu.location,
            degree          = edu.degree,
            start_date      = edu.start_date,
            end_date        = None if edu.is_present else edu.end_date,
            is_present      = edu.is_present,
            passout_year    = edu.passout_year,
        )
        for edu in edu_list
    ]


def _apply_profile_fields(orm_obj: Profile, data: ProfileCreate, full_name: str | None = None):
    """Write all ProfileCreate fields onto an ORM Profile object in one place."""
    if full_name is not None:
        orm_obj.full_name           = full_name

    orm_obj.phone                   = data.phone
    orm_obj.location                = data.location
    orm_obj.skills                  = data.skills
    orm_obj.linkedin_url            = data.linkedin_url
    orm_obj.portfolio_url           = data.portfolio_url
    orm_obj.expected_ctc            = data.expected_ctc
    orm_obj.currently_employed      = data.currently_employed

    # Employment — only persist details when currently employed
    if data.currently_employed:
        orm_obj.company_name        = data.company_name
        orm_obj.designation         = data.designation
        orm_obj.emp_start_date      = data.emp_start_date
        orm_obj.emp_end_date        = None if data.emp_is_present else data.emp_end_date
        orm_obj.emp_is_present      = data.emp_is_present
        orm_obj.about_role          = data.about_role
    else:
        orm_obj.company_name        = None
        orm_obj.designation         = None
        orm_obj.emp_start_date      = None
        orm_obj.emp_end_date        = None
        orm_obj.emp_is_present      = False
        orm_obj.about_role          = None


# ── POST /profiles/{user_id} ──────────────────────────────────────────────────

@router.post("/{user_id}", response_model=ProfileResponse)
def create_profile(
    user_id: int,
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):
    # Prevent duplicate profiles
    existing = db.query(Profile).filter(Profile.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")

    # Pull full_name from the User table
    from app.models import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_profile = Profile(user_id=user_id)
    _apply_profile_fields(new_profile, profile, full_name=user.name)

    db.add(new_profile)
    db.flush()  # get new_profile.id before inserting education rows

    edu_rows = _build_education(new_profile.id, profile.education_history)
    db.add_all(edu_rows)

    db.commit()
    db.refresh(new_profile)
    return new_profile


# ── GET /profiles/{user_id} ───────────────────────────────────────────────────

@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


# ── PUT /profiles/{user_id} ───────────────────────────────────────────────────

@router.put("/{user_id}", response_model=ProfileResponse)
def update_profile(
    user_id: int,
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found. Use POST to create.")

    _apply_profile_fields(existing, profile)

    # Replace education rows entirely (cascade delete handles old ones)
    db.query(EducationHistory).filter(
        EducationHistory.profile_id == existing.id
    ).delete()

    edu_rows = _build_education(existing.id, profile.education_history)
    db.add_all(edu_rows)

    db.commit()
    db.refresh(existing)
    return existing