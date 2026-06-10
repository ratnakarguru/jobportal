from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Float, Text, Date, JSON
from app.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "candidate"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(100))

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("candidate.id"))
    role_name = Column(String(50))

    user = relationship("User")


class Profile(Base):
    __tablename__ = "profiles"
 
    # ── Primary & Foreign Keys ──────────────────────────────────────
    id                  = Column(Integer, primary_key=True, index=True)
    user_id             = Column(Integer, ForeignKey("candidate.id"))
 
    # ── Basic Information ───────────────────────────────────────────
    full_name           = Column(String(100))
    phone               = Column(String(50))
    location            = Column(String(100))
 
    # ── Professional Links ──────────────────────────────────────────
    linkedin_url        = Column(String(255))
    portfolio_url       = Column(String(255))
 
    # ── Career Details ──────────────────────────────────────────────
    skills              = Column(Text)
    expected_ctc        = Column(Float)
 
    # ── Employment Status ───────────────────────────────────────────
    currently_employed  = Column(Boolean, default=False)
    company_name        = Column(String(100))       # replaces previous_company
    designation         = Column(String(100))
    emp_start_date      = Column(Date, nullable=True)
    emp_end_date        = Column(Date, nullable=True)
    emp_is_present      = Column(Boolean, default=False)
    about_role          = Column(Text, nullable=True)
 
    # ── Relationships ───────────────────────────────────────────────
    user                = relationship("User")
    education_history   = relationship(
        "EducationHistory",
        back_populates="profile",
        cascade="all, delete-orphan"
    )


class EducationHistory(Base):
    __tablename__ = "education_history"
 
    # ── Primary & Foreign Keys ──────────────────────────────────────
    id              = Column(Integer, primary_key=True, index=True)
    profile_id      = Column(Integer, ForeignKey("profiles.id"))
 
    # ── Institution Details ─────────────────────────────────────────
    college_name    = Column(String(200))
    location        = Column(String(100))
    degree          = Column(String(150), nullable=True)
 
    # ── Dates ───────────────────────────────────────────────────────
    start_date      = Column(Date, nullable=True)
    end_date        = Column(Date, nullable=True)   # null when is_present=True
    is_present      = Column(Boolean, default=False)
    passout_year    = Column(Integer, nullable=True)
 
    # ── Relationship ────────────────────────────────────────────────
    profile         = relationship("Profile", back_populates="education_history")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("candidate.id"))
    resume_file = Column(String(255))
    parsed_data = Column(JSON)

    user = relationship("User")
    
