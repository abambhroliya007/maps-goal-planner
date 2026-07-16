import math
import time
import requests

from app.services.ranking_service import rank_candidates

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

CATEGORY_SEARCH_TERMS = {
    "coffee_shop": ["Starbucks", "Dutch Bros Coffee", "Peet's Coffee", "coffee shop", "cafe", "espresso"],
    "restaurant": ["restaurant", "cafe", "sandwich shop", "Chipotle"],
    "grocery_store": ["grocery store", "Safeway", "Trader Joe's", "Walmart"],
    "warehouse_store": ["Costco", "Sam's Club", "warehouse store"],
    "shipping": ["UPS Store", "FedEx Office", "post office", "USPS"],
    "pharmacy": ["CVS Pharmacy", "Walgreens", "pharmacy"],
    "bookstore": ["bookstore", "college bookstore", "Barnes & Noble"],
    "office_supplies": ["Staples", "Office Depot", "office supply store", "Target"],
    "barbershop": ["barbershop", "Sport Clips", "Great Clips", "Supercuts"],
    "hair_salon": ["hair salon", "barbershop", "Great Clips", "Supercuts"],
    "golf_course": ["golf course", "public golf course", "country club"],
    "gym": ["gym", "fitness center", "Planet Fitness", "24 Hour Fitness"],
    "park": ["park", "public park"],
    "gas_station": ["gas station", "Chevron", "Shell"],
    "bank": ["bank", "Chase Bank", "Bank of America", "Wells Fargo"],
    "electronics_store": ["Best Buy", "electronics store", "Apple Store"],
    "home_improvement": ["Home Depot", "Lowe's", "hardware store"],
    "clothing_store": ["clothing store", "department store", "Macy's"],
    "department_store": ["Target", "Walmart", "Macy's"],
    "car_wash": ["car wash"],
    "doctor": ["doctor office", "medical clinic"],
    "dentist": ["dentist", "dental office"],
    "urgent_care": ["urgent care", "medical clinic"],
    "movie_theater": ["movie theater", "cinema", "AMC"],
    "museum": ["museum"],
    "hotel": ["hotel"],
    "airport": ["airport"],
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
                "limit": 10,
                "countrycodes": "us",
            }

            headers = {"User-Agent": "maps-goal-planner-portfolio-project"}

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

                if distance > 75:
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
        return {"selected": None, "alternatives": []}

    return {"selected": ranked[0], "alternatives": ranked[1:4]}