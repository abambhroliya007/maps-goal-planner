import math
import time
import requests

from app.services.ranking_service import choose_best_candidate

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

CATEGORY_SEARCH_TERMS = {
    "coffee": ["Starbucks", "Peet's Coffee", "Temple Coffee Roasters", "coffee shop"],
    "food": ["restaurant", "lunch", "food"],
    "groceries": ["grocery store", "Safeway", "Trader Joe's"],
    "shipping": ["UPS Store", "FedEx Office", "post office", "shipping store"],
    "pharmacy": ["pharmacy", "CVS Pharmacy", "Walgreens"],
    "office_supplies": ["bookstore", "office supply store", "Staples", "Target", "CVS"],}


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
    city_context: str = "Sacramento, CA, USA",
):
    search_terms = CATEGORY_SEARCH_TERMS.get(category, [category])
    candidates = []

    for term in search_terms:
        params = {
            "q": f"{term}, {city_context}",
            "format": "json",
            "limit": 3,
            "countrycodes": "us",
        }

        headers = {
            "User-Agent": "maps-goal-planner-portfolio-project"
        }

        response = requests.get(
            NOMINATIM_URL,
            params=params,
            headers=headers,
            timeout=10,
        )
        response.raise_for_status()

        results = response.json()
        time.sleep(0.2)

        for result in results:
            lat = float(result["lat"])
            lon = float(result["lon"])

            distance = haversine_miles(start_lat, start_lon, lat, lon)

            candidates.append(
                {
                    "name": result.get("display_name", term).split(",")[0],
                    "display_name": result.get("display_name", term),
                    "lat": lat,
                    "lon": lon,
                    "distance_miles": round(distance, 2),
                    "category": category,
                    "search_term": term,
                }
            )

    unique_candidates = {}
    for candidate in candidates:
        key = f"{candidate['lat']}-{candidate['lon']}"
        unique_candidates[key] = candidate

    return list(unique_candidates.values())


def choose_best_place_for_category(
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

    return choose_best_candidate(candidates)