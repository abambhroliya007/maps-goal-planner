from app.services.ai_service import generate_ai_plan
from app.services.geocoding_service import geocode_place
from app.services.place_search_service import get_ranked_places_for_category
from app.services.routing_service import get_route


MAX_ROUTE_DISTANCE_MILES = 20


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


def distance_score(current_lat: float, current_lon: float, stop: dict) -> float:
    if stop.get("lat") is None or stop.get("lon") is None:
        return float("inf")

    return ((current_lat - stop["lat"]) ** 2 + (current_lon - stop["lon"]) ** 2) ** 0.5


def optimize_stop_order(start_geo: dict, stops: list[dict]) -> list[dict]:
    valid_stops = [
        stop
        for stop in stops
        if stop.get("lat") is not None and stop.get("lon") is not None
    ]

    invalid_stops = [
        stop
        for stop in stops
        if stop.get("lat") is None or stop.get("lon") is None
    ]

    optimized = []
    remaining = valid_stops[:]

    current_lat = start_geo["lat"]
    current_lon = start_geo["lon"]

    while remaining:
        next_stop = min(
            remaining,
            key=lambda stop: distance_score(current_lat, current_lon, stop),
        )

        optimized.append(next_stop)
        remaining.remove(next_stop)

        current_lat = next_stop["lat"]
        current_lon = next_stop["lon"]

    return optimized + invalid_stops


def should_include_in_route(stop: dict) -> bool:
    selected = stop.get("selected_place")

    if not selected:
        return False

    lat = selected.get("lat")
    lon = selected.get("lon")

    if lat is None or lon is None:
        return False

    distance = selected.get("distance_miles")

    if distance is not None and distance > MAX_ROUTE_DISTANCE_MILES:
        return False

    return True


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
            search_query=intent.get("search_query"),
        )

        selected_place = ranked_places["selected"]
        alternatives = ranked_places["alternatives"]

        if selected_place:
            cleaned_selected = clean_place_option(selected_place)

            stop = {
                "name": intent["label"],
                "query": selected_place["display_name"],
                "estimated_minutes": intent["estimated_minutes"],
                "reason": intent["reason"],
                "lat": selected_place["lat"],
                "lon": selected_place["lon"],
                "selected_place": cleaned_selected,
                "alternatives": [
                    clean_place_option(place) for place in alternatives
                ],
            }
        else:
            stop = {
                "name": intent["label"],
                "query": intent.get("search_query") or intent["category"],
                "estimated_minutes": intent["estimated_minutes"],
                "reason": intent["reason"],
                "lat": None,
                "lon": None,
                "selected_place": None,
                "alternatives": [],
            }

        geocoded_stops.append(stop)

    optimized_stops = optimize_stop_order(start_geo, geocoded_stops)

    route_points = [
        {
            "lat": start_geo["lat"],
            "lon": start_geo["lon"],
        }
    ]

    for stop in optimized_stops:
        if should_include_in_route(stop):
            selected = stop["selected_place"]

            route_points.append(
                {
                    "lat": selected["lat"],
                    "lon": selected["lon"],
                }
            )

    route = None

    if len(route_points) >= 2:
        route = get_route(route_points)

    return {
        "summary": ai_plan["summary"],
        "stops": optimized_stops,
        "total_estimated_minutes": ai_plan["total_estimated_minutes"],
        "reasoning": ai_plan["reasoning"]
        + " The route was optimized around the most relevant nearby stops.",
        "route_geometry": route["geometry"] if route else None,
        "route_distance_meters": route["distance_meters"] if route else None,
        "route_duration_seconds": route["duration_seconds"] if route else None,
    }