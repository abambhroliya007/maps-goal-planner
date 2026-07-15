from fastapi import APIRouter

from app.schemas.planner import PlanRequest, PlanResponse
from app.services.planner_service import create_goal_plan

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "backend running"}


@router.post("/plan", response_model=PlanResponse)
def plan_trip(request: PlanRequest):
    return create_goal_plan(
        user_goal=request.user_goal,
        start_location=request.start_location,
    )