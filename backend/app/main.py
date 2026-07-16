from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import router

app = FastAPI(
    title="Maps: Goal Planner API",
    description="AI-powered goal-based trip planner backend.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Maps: Goal Planner API", "cors": "enabled-v2"}


@app.get("/cors-test")
def cors_test():
    return {"cors": "enabled", "status": "ok"}