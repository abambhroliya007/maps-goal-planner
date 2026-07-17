from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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

@app.middleware("http")
async def catch_backend_errors(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as error:
        return JSONResponse(
            status_code=500,
            content={"error": str(error)},
            headers={"Access-Control-Allow-Origin": "*"},
        )

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Maps: Goal Planner API", "cors": "enabled"}