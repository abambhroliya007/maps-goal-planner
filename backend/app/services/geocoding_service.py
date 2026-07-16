import time
import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

CATEGORY_FALLBACKS = {
    "coffee shop": ["Starbucks", "coffee", "cafe"],
    "restaurant": ["restaurant", "lunch", "food"],
    "grocery store": ["Safeway", "Trader Joe's", "grocery"],
    "office supply store": ["Staples", "Office Depot", "stationery", "bookstore"],
    "stationery store": ["Staples", "Office Depot", "bookstore"],
    "shipping store": ["UPS Store", "FedEx Office", "shipping"],
    "ups store": ["UPS Store"],
    "pharmacy": ["CVS Pharmacy", "Walgreens", "pharmacy"],
}


def geocode_place(query: str):
    params = {
        "q": query,
        "format": "json",
        "limit": 1,
        "countrycodes": "us",
    }

    headers = {
        "User-Agent": "maps-goal-planner-portfolio-project/1.0"
    }

    for attempt in range(3):
        response = requests.get(
            NOMINATIM_URL,
            params=params,
            headers=headers,
            timeout=10,
        )

        if response.status_code == 429:
            time.sleep(2 + attempt * 2)
            continue

        response.raise_for_status()

        data = response.json()
        time.sleep(1)

        if not data:
            return None

        result = data[0]

        return {
            "lat": float(result["lat"]),
            "lon": float(result["lon"]),
            "display_name": result.get("display_name", query),
        }

    return None


def geocode_place_near(query: str, near_location: str):
    normalized_query = query.strip().lower()
    fallback_terms = CATEGORY_FALLBACKS.get(normalized_query, [query])

    search_queries = []

    for term in fallback_terms:
        search_queries.extend(
            [
                f"{term}, Sacramento, CA, USA",
                f"{term}, East Sacramento, CA, USA",
                f"{term}, California State University Sacramento, Sacramento, CA, USA",
            ]
        )

    for search_query in search_queries:
        location = geocode_place(search_query)

        if location:
            return location

        time.sleep(1)

    return None