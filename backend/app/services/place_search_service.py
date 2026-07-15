import math
import time
import requests

from app.services.ranking_service import rank_candidates, choose_best_candidate

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

CATEGORY_SEARCH_TERMS = {
    "coffee": ["Starbucks", "Peet's Coffee", "coffee shop", "cafe"],
    "food": ["restaurant", "cafe", "sandwich shop", "Chipotle"],
    "groceries": ["grocery store", "Safeway", "Trader Joe's", "Target"],
    "shipping": ["UPS Store", "FedEx Office", "post office", "USPS"],
    "pharmacy": ["CVS Pharmacy", "Walgreens", "pharmacy"],
    "office_supplies": ["bookstore", "college bookstore", "Staples", "Target"],
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


def build_search_contexts(city_context: str) -> list[str]:
    parts = [part.strip() for part in city_context.split(",")]
    contexts = [city_context]

    if len(parts) >= 2:
        contexts.append(", ".join(parts[-2:]))

    contexts.append(f"{city_context}, USA")

    return list(dict.fromkeys(contexts))


def search_places_near_category(
    category: str,
    start_lat: float,
    start_lon: float,
    city_context: str,
):
    search_terms = CATEGORY_SEARCH_TERMS.get(category, [category])
    search_contexts = build_search_contexts(city_context)
    candidates = []

    for term in search_terms:
        for context in search_contexts:
            params = {
                "q": f"{term}, {context}",
                "format": "json",
                "limit": 5,
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

                if distance > 25:
                    continue

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
        return {
            "selected": None,
            "alternatives": [],
        }

    return {
        "selected": ranked[0],
        "alternatives": ranked[1:4],
    }


def choose_best_place_for_category(
    category: str,
    start_lat: float,
    start_lon: float,
    city_context: str,
):
    ranked_places = get_ranked_places_for_category(
        category=category,
        start_lat=start_lat,
        start_lon=start_lon,
        city_context=city_context,
    )

    return ranked_places["selected"]