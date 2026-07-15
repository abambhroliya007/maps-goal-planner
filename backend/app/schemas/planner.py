from pydantic import BaseModel
from typing import List, Optional


class PlaceOption(BaseModel):
    name: Optional[str] = None
    display_name: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    distance_miles: Optional[float] = None
    score: Optional[float] = None
    confidence: Optional[float] = None


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
    selected_place: Optional[PlaceOption] = None
    alternatives: List[PlaceOption] = []


class PlanResponse(BaseModel):
    summary: str
    stops: List[Stop]
    total_estimated_minutes: int
    reasoning: str
    route_geometry: Optional[dict] = None
    route_distance_meters: Optional[float] = None
    route_duration_seconds: Optional[float] = None