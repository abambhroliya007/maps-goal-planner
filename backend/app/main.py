from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from app.api.v1.routes import router

app = FastAPI(
    title="Maps: Goal Planner API",
    description="AI-powered goal-based trip planner backend.",
    version="0.1.0",
)

ALLOWED_ORIGINS = {
    "https://maps-goal-planner-rjzi.vercel.app",
    "https://maps-goal-planner-rjzi-git-main-ayushs-projects-f5ec9f23.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}


@app.middleware("http")
async def force_cors_headers(request: Request, call_next):
    origin = request.headers.get("origin")

    if request.method == "OPTIONS":
        response = Response(status_code=200)
    else:
        response = await call_next(request)

    if origin in ALLOWED_ORIGINS or (origin and origin.endswith(".vercel.app")):
        response.headers["Access-Control-Allow-Origin"] = origin

    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"

    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=list(ALLOWED_ORIGINS),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Maps: Goal Planner API", "cors": "forced"}


@app.get("/cors-test")
def cors_test():
    return {"cors": "enabled", "status": "ok"}