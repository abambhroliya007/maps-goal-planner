from app.services.ai_service import generate_ai_plan
from app.services.geocoding_service import geocode_place
from app.services.place_search_service import get_ranked_places_for_category
from app.services.routing_service import get_route


def clean_place_option(place: dict) -> dict:
    return {
        "name": place.get("name"),
        "display_name": place.get("display_name"),
        "lat": place.get("lat"),
        "lon": place.get("lon"),
        "distance_miles": place.get("distance_miles"),
        "score": place.get("score"),
        "confidence": place.get("confidence"),
    }


def create_goal_plan(user_goal: str, start_location: str) -> dict:
    ai_plan = generate_ai_plan(user_goal, start_location)

    start_geo = geocode_place(start_location)

    if not start_geo:
        return {
            "summary": "Could not locate the starting point.",
            "stops": [],
            "total_estimated_minutes": 0,
            "reasoning": "The starting location could not be geocoded.",
            "route_geometry": None,
            "route_distance_meters": None,
            "route_duration_seconds": None,
        }

    geocoded_stops = []

    for intent in ai_plan["intents"]:
        ranked_places = get_ranked_places_for_category(
            category=intent["category"],
            start_lat=start_geo["lat"],
            start_lon=start_geo["lon"],
            city_context=start_location,
        )

        selected_place = ranked_places["selected"]
        alternatives = ranked_places["alternatives"]

        if selected_place:
            stop = {
                "name": intent["label"],
                "query": selected_place["display_name"],
                "estimated_minutes": intent["estimated_minutes"],
                "reason": intent["reason"],
                "lat": selected_place["lat"],
                "lon": selected_place["lon"],
                "selected_place": clean_place_option(selected_place),
                "alternatives": [
                    clean_place_option(place) for place in alternatives
                ],
            }
        else:
            stop = {
                "name": intent["label"],
                "query": intent["category"],
                "estimated_minutes": intent["estimated_minutes"],
                "reason": intent["reason"],
                "lat": None,
                "lon": None,
                "selected_place": None,
                "alternatives": [],
            }

        geocoded_stops.append(stop)

    route_points = [{"lat": start_geo["lat"], "lon": start_geo["lon"]}]

    for stop in geocoded_stops:
        if stop.get("lat") and stop.get("lon"):
            route_points.append(
                {
                    "lat": stop["lat"],
                    "lon": stop["lon"],
                }
            )

    route = None

    if len(route_points) >= 2:
        route = get_route(route_points)

    return {
        "summary": ai_plan["summary"],
        "stops": geocoded_stops,
        "total_estimated_minutes": ai_plan["total_estimated_minutes"],
        "reasoning": ai_plan["reasoning"],
        "route_geometry": route["geometry"] if route else None,
        "route_distance_meters": route["distance_meters"] if route else None,
        "route_duration_seconds": route["duration_seconds"] if route else None,
    }