from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class RoleCreate(BaseModel):
    role_name: str
    
class EducationHistoryCreate(BaseModel):
    college_name:   str
    location:       str
    degree:         Optional[str]       = None
    start_date:     Optional[date]      = None
    end_date:       Optional[date]      = None      # null when is_present=True
    is_present:     bool                = False
    passout_year:   Optional[int]       = None
 
 
class EducationHistoryResponse(EducationHistoryCreate):
    id: int
 
    class Config:
        from_attributes = True
 
 
# ── Profile ──────────────────────────────────────────────────────────────────
 
class ProfileCreate(BaseModel):
    # Basic
    phone:              str
    location:           str
    skills:             str
 
    # Links
    linkedin_url:       Optional[str]   = None
    portfolio_url:      Optional[str]   = None
 
    # Compensation
    expected_ctc:       Optional[float] = None
 
    # Employment
    currently_employed: bool            = False
    company_name:       Optional[str]   = None
    designation:        Optional[str]   = None
    emp_start_date:     Optional[date]  = None
    emp_end_date:       Optional[date]  = None
    emp_is_present:     bool            = False
    about_role:         Optional[str]   = None
 
    # Education (list of institutions)
    education_history:  List[EducationHistoryCreate] = []
 
 
class ProfileResponse(BaseModel):
    id:                 int
    user_id:            int
    full_name:          Optional[str]
    phone:              Optional[str]
    location:           Optional[str]
    skills:             Optional[str]
    linkedin_url:       Optional[str]
    portfolio_url:      Optional[str]
    expected_ctc:       Optional[float]
    currently_employed: bool
    company_name:       Optional[str]
    designation:        Optional[str]
    emp_start_date:     Optional[date]
    emp_end_date:       Optional[date]
    emp_is_present:     bool
    about_role:         Optional[str]
    education_history:  List[EducationHistoryResponse] = []

# ── Resume ────────────────────────────────────────────────────────────────────

class ResumeResponse(BaseModel):
    id:          int
    user_id:     int
    resume_file: str | None = None

    class Config:
        from_attributes = True
 
class ApplicationCreate(BaseModel):
    user_id: int
    job_id: int