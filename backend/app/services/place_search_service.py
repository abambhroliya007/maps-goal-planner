import math
import time
import requests

from app.services.ranking_service import rank_candidates

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

CATEGORY_SEARCH_TERMS = {
    "coffee_shop": [
        "Starbucks",
        "coffee",
        "coffee shop",
        "Dutch Bros",
        "Peet's Coffee",
    ],
    "restaurant": [
        "restaurant",
        "food",
        "fast food",
        "lunch",
        "pizza",
        "mexican restaurant",
        "thai restaurant",
        "sandwich",
        "burger",
        "cafe",
    ],
    "shipping": [
        "UPS Store",
        "FedEx Office",
        "post office",
        "USPS",
        "shipping",
    ],
    "office_supplies": [
        "Staples",
        "Office Depot",
        "office supply store",
        "notebooks",
        "school supplies",
        "Target",
        "Walmart",
    ],
    "sporting_goods": [
        "Golf Galaxy",
        "Dick's Sporting Goods",
        "PGA Tour Superstore",
        "Big 5 Sporting Goods",
        "sporting goods",
        "golf balls",
        "golf store",
    ],
    "pet_store": [
        "PetSmart",
        "Petco",
        "pet store",
        "pet supplies",
    ],
    "florist": [
        "florist",
        "flower shop",
        "flowers",
    ],
    "home_improvement": [
        "Home Depot",
        "Lowe's",
        "Ace Hardware",
        "Harbor Freight",
        "hardware",
        "hardware store",
        "home improvement",
        "tools",
    ],
    "grocery_store": [
        "grocery store",
        "supermarket",
        "Safeway",
        "Walmart",
        "Target",
        "Trader Joe's",
    ],
    "warehouse_store": [
        "Costco",
        "warehouse store",
        "Sam's Club",
    ],
    "pharmacy": [
        "pharmacy",
        "CVS",
        "Walgreens",
        "Rite Aid",
    ],
    "bookstore": [
        "bookstore",
        "books",
        "Barnes Noble",
    ],
    "barbershop": [
        "barbershop",
        "barber",
        "Great Clips",
        "Supercuts",
    ],
    "hair_salon": [
        "hair salon",
        "salon",
        "Great Clips",
        "Supercuts",
    ],
    "golf_course": [
        "golf course",
    ],
    "gym": [
        "gym",
        "fitness center",
        "Planet Fitness",
        "24 Hour Fitness",
    ],
    "park": [
        "park",
    ],
    "gas_station": [
        "gas station",
        "Chevron",
        "Shell",
        "76 gas station",
    ],
    "bank": [
        "bank",
        "Chase Bank",
        "Bank of America",
        "Wells Fargo",
    ],
    "electronics_store": [
        "electronics store",
        "Best Buy",
        "Apple Store",
    ],
    "clothing_store": [
        "clothing store",
        "department store",
        "Macy's",
    ],
    "department_store": [
        "Target",
        "Walmart",
        "Macy's",
        "department store",
    ],
    "car_wash": [
        "car wash",
    ],
    "doctor": [
        "medical clinic",
        "doctor office",
    ],
    "dentist": [
        "dentist",
        "dental office",
    ],
    "urgent_care": [
        "urgent care",
        "medical clinic",
    ],
    "movie_theater": [
        "movie theater",
        "cinema",
    ],
    "museum": [
        "museum",
    ],
    "hotel": [
        "hotel",
    ],
    "airport": [
        "airport",
    ],
}


def haversine_miles(lat1, lon1, lat2, lon2):
    radius = 3958.8
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)

    a = (
        math.sin(dp / 2) ** 2
        + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    )

    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def get_search_area(city_context: str) -> str:
    parts = [part.strip() for part in city_context.split(",")]

    if len(parts) >= 3:
        city = parts[-2]
        state = parts[-1].split()[0]
        return f"{city}, {state}"

    if len(parts) >= 2:
        return f"{parts[-2]}, {parts[-1].split()[0]}"

    return city_context


def build_search_terms(category: str, search_query: str | None = None) -> list[str]:
    terms = []

    if search_query:
        terms.append(search_query)

    terms.extend(CATEGORY_SEARCH_TERMS.get(category, [category.replace("_", " ")]))

    deduped = []
    seen = set()

    for term in terms:
        normalized = term.strip().lower()

        if normalized and normalized not in seen:
            deduped.append(term)
            seen.add(normalized)

    return deduped


def search_places_near_category(
    category,
    start_lat,
    start_lon,
    city_context,
    search_query=None,
):
    search_area = get_search_area(city_context)
    search_terms = build_search_terms(category, search_query)

    headers = {
        "User-Agent": "maps-goal-planner-portfolio-project/1.0"
    }

    candidates = []

    for term in search_terms:
        params = {
            "q": f"{term}, {search_area}",
            "format": "json",
            "limit": 10,
            "countrycodes": "us",
        }

        try:
            response = requests.get(
                NOMINATIM_URL,
                params=params,
                headers=headers,
                timeout=10,
            )

            if response.status_code == 429:
                print(f"Nominatim rate limited for {term}")
                time.sleep(2)
                continue

            response.raise_for_status()
            results = response.json()

        except requests.RequestException as error:
            print(f"Search failed for {term}: {error}")
            continue

        time.sleep(1)

        for result in results:
            lat = float(result["lat"])
            lon = float(result["lon"])
            distance = haversine_miles(start_lat, start_lon, lat, lon)

            if distance > 20:
                continue

            display_name = result.get("display_name", term)

            candidates.append(
                {
                    "name": display_name.split(",")[0],
                    "display_name": display_name,
                    "lat": lat,
                    "lon": lon,
                    "distance_miles": round(distance, 2),
                    "category": category,
                    "search_term": term,
                }
            )

    unique = {}

    for candidate in candidates:
        key = f"{round(candidate['lat'], 6)}-{round(candidate['lon'], 6)}"
        unique[key] = candidate

    print(f"{category} near {search_area}: {len(unique)} results")

    return list(unique.values())


def get_ranked_places_for_category(
    category,
    start_lat,
    start_lon,
    city_context,
    search_query=None,
):
    candidates = search_places_near_category(
        category=category,
        start_lat=start_lat,
        start_lon=start_lon,
        city_context=city_context,
        search_query=search_query,
    )

    ranked = rank_candidates(candidates)

    if not ranked:
        return {"selected": None, "alternatives": []}

    return {"selected": ranked[0], "alternatives": ranked[1:4]}