from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Float
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

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("candidate.id"))

    full_name = Column(String(100))
    phone = Column(String(20))

    title = Column(String(100))
    portfolio = Column(String(255))

    company_name = Column(String(100))
    company_website = Column(String(255))

    currently_employed = Column(Boolean, default=False)
    previous_company = Column(String(100))
    years_of_experience = Column(Integer)
    current_ctc = Column(Float)
    expected_ctc = Column(Float)

    user = relationship("User")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("candidate.id"))
    resume_file = Column(String(255))

    user = relationship("User")
