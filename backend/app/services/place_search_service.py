import math
import os
import requests

from app.services.ranking_service import rank_candidates

GEOAPIFY_URL = "https://api.geoapify.com/v2/places"

CATEGORY_FILTERS = {
    "coffee_shop": "catering.cafe",
    "restaurant": "catering.restaurant",
    "grocery_store": "commercial.supermarket",
    "warehouse_store": "commercial.supermarket",
    "shipping": "service.post_office",
    "pharmacy": "healthcare.pharmacy",
    "bookstore": "commercial.books",
    "office_supplies": "commercial",
    "barbershop": "commercial.hairdresser",
    "hair_salon": "commercial.hairdresser",
    "golf_course": "sport.golf",
    "gym": "sport.fitness",
    "park": "leisure.park",
    "gas_station": "service.vehicle.fuel",
    "bank": "service.financial.bank",
    "electronics_store": "commercial.elektronics",
    "home_improvement": "commercial.houseware_and_hardware",
    "clothing_store": "commercial.clothing",
    "department_store": "commercial.department_store",
    "car_wash": "service.vehicle.car_wash",
    "doctor": "healthcare.doctor",
    "dentist": "healthcare.dentist",
    "urgent_care": "healthcare",
    "movie_theater": "entertainment.cinema",
    "museum": "entertainment.museum",
    "hotel": "accommodation.hotel",
    "airport": "airport",
}


def haversine_miles(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius_miles = 3958.8
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius_miles * c


def search_places_near_category(
    category: str,
    start_lat: float,
    start_lon: float,
    city_context: str,
):
    api_key = os.getenv("GEOAPIFY_API_KEY")

    if not api_key:
        raise RuntimeError("GEOAPIFY_API_KEY is not set in environment variables.")

    geoapify_category = CATEGORY_FILTERS.get(category, "commercial")

    params = {
        "categories": geoapify_category,
        "filter": f"circle:{start_lon},{start_lat},12000",
        "bias": f"proximity:{start_lon},{start_lat}",
        "limit": 20,
        "apiKey": api_key,
    }

    response = requests.get(
        GEOAPIFY_URL,
        params=params,
        timeout=15,
    )
    response.raise_for_status()

    data = response.json()
    candidates = []

    for feature in data.get("features", []):
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        coordinates = geometry.get("coordinates", [])

        if len(coordinates) < 2:
            continue

        lon = float(coordinates[0])
        lat = float(coordinates[1])

        distance = haversine_miles(start_lat, start_lon, lat, lon)

        if distance > 75:
            continue

        name = (
            properties.get("name")
            or properties.get("address_line1")
            or properties.get("formatted")
            or category.replace("_", " ").title()
        )

        display_name = (
            properties.get("formatted")
            or properties.get("address_line2")
            or name
        )

        candidates.append(
            {
                "name": name,
                "display_name": display_name,
                "lat": lat,
                "lon": lon,
                "distance_miles": round(distance, 2),
                "category": category,
                "search_term": geoapify_category,
            }
        )

    unique_candidates = {}

    for candidate in candidates:
        key = f"{round(candidate['lat'], 6)}-{round(candidate['lon'], 6)}"
        unique_candidates[key] = candidate

    return list(unique_candidates.values())


def get_ranked_places_for_category(
    category: str,
    start_lat: float,
    start_lon: float,
    city_context: str,
):
    candidates = search_places_near_category(
        category=category,
        start_lat=start_lat,
        start_lon=start_lon,
        city_context=city_context,
    )

    ranked = rank_candidates(candidates)

    if not ranked:
        return {"selected": None, "alternatives": []}

    return {"selected": ranked[0], "alternatives": ranked[1:4]}