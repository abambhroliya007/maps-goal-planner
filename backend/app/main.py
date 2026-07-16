from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Maps: Goal Planner API",
    description="AI-powered goal-based trip planner backend.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://maps-goal-planner-rjzi.vercel.app",
        "https://maps-goal-planner-rjzi-git-main-ayushs-projects-f5ec9f23.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.routes import router

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Maps: Goal Planner API", "cors": "enabled-final"}


@app.get("/cors-test")
def cors_test():
    return {"cors": "enabled", "status": "ok"}