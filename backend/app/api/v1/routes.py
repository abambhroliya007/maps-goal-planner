from fastapi import APIRouter

from app.schemas.planner import PlanRequest, PlanResponse, RouteRequest
from app.services.planner_service import create_goal_plan
from app.services.routing_service import get_route

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


@router.post("/route")
def calculate_route(request: RouteRequest):
    points = [{"lat": point.lat, "lon": point.lon} for point in request.points]
    route = get_route(points)

    if not route:
        return {
            "route_geometry": None,
            "route_distance_meters": None,
            "route_duration_seconds": None,
        }

    return {
        "route_geometry": route["geometry"],
        "route_distance_meters": route["distance_meters"],
        "route_duration_seconds": route["duration_seconds"],
    }