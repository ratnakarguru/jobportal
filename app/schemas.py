from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class RoleCreate(BaseModel):
    role_name: str
    
class ProfileCreate(BaseModel):
    full_name: str
    phone: str
    location: str
    skills: str
    education: str
    experience: str

    linkedin_url: str | None = None
    portfolio_url: str | None = None

    currently_employed: bool = False
    previous_company: str | None = None
    expected_ctc: float | None = None