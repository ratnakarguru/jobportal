from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base

from app.routers import auth, users, onboarding , roles , profile , resumes ,dashboard , jobs


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://worklinejob.netlify.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(onboarding.router)
app.include_router(roles.router)
app.include_router(profile.router)
app.include_router(resumes.router)
app.include_router(dashboard.router)
app.include_router(jobs.router)



@app.get("/")
def home():
    return {"message": "API Running"}