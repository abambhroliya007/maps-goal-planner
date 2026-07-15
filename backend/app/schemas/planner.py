from pydantic import BaseModel
from typing import List, Optional


class PlanRequest(BaseModel):
    user_goal: str
    start_location: str


class Stop(BaseModel):
    name: str
    query: str
    estimated_minutes: int
    reason: str
    lat: Optional[float] = None
    lon: Optional[float] = None


class PlanResponse(BaseModel):
    summary: str
    stops: List[Stop]
    total_estimated_minutes: int
    reasoning: str
    route_geometry: Optional[dict] = None
    route_distance_meters: Optional[float] = None
    route_duration_seconds: Optional[float] = None