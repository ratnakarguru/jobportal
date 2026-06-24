import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Float, Text, Date, JSON, Enum, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "candidate"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(100))

    # Added back-references for clean queries from the User instance
    profile = relationship("Profile", back_populates="user", uselist=False)
    roles = relationship("Role", back_populates="user")
    resumes = relationship("Resume", back_populates="user")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("candidate.id"))
    role_name = Column(String(50))

    user = relationship("User", back_populates="roles")


class Profile(Base):
    __tablename__ = "job_profiles"
 
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
    skills              = Column(Text)  # Stored as comma-separated text
    expected_ctc        = Column(Float)
 
    # ── Employment Status ───────────────────────────────────────────
    currently_employed  = Column(Boolean, default=False)
    company_name        = Column(String(100))
    designation         = Column(String(100))
    emp_start_date      = Column(Date, nullable=True)
    emp_end_date        = Column(Date, nullable=True)
    emp_is_present      = Column(Boolean, default=False)
    about_role          = Column(Text, nullable=True)
 
    # ── Relationships ───────────────────────────────────────────────
    user                = relationship("User", back_populates="profile")
    education_history   = relationship(
        "EducationHistory",
        back_populates="profile",
        cascade="all, delete-orphan"
    )


class EducationHistory(Base):
    __tablename__ = "education_history"
 
    # ── Primary & Foreign Keys ──────────────────────────────────────
    id              = Column(Integer, primary_key=True, index=True)
    profile_id      = Column(Integer, ForeignKey("job_profiles.id"))
 
    # ── Institution Details ─────────────────────────────────────────
    college_name    = Column(String(200))
    location        = Column(String(100))
    degree          = Column(String(150), nullable=True)
 
    # ── Dates ───────────────────────────────────────────────────────
    start_date      = Column(Date, nullable=True)
    end_date        = Column(Date, nullable=True)
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

    user = relationship("User", back_populates="resumes")


class JobStatus(str, enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    company = Column(String(100), nullable=False)
    location = Column(String(100), nullable=True)
    salary = Column(String(50), nullable=True)
    experience = Column(String(50), nullable=True)
    qualification = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)  # Comma-separated text
    skills = Column(Text, nullable=True)            # Comma-separated text
    benefits = Column(Text, nullable=True)          # Comma-separated text
    company_about = Column(Text, nullable=True)
    status = Column(Enum(JobStatus), default=JobStatus.OPEN)

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("candidate.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    status = Column(String(20), default="Applied")

    applied_at = Column(DateTime, default=datetime.utcnow)

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(100))
    company_about = Column(Text)
    status = Column(String(20))