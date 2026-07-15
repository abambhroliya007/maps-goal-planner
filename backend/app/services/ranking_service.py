CATEGORY_KEYWORDS = {
    "coffee": {
        "good": ["starbucks", "peet", "coffee", "cafe", "espresso", "roasters"],
        "bad": ["sushi", "bar and grill", "pizza", "burger", "taco"],
    },
    "food": {
        "good": ["restaurant", "cafe", "grill", "kitchen", "sandwich", "chipotle"],
        "bad": ["gas station", "pharmacy", "bank"],
    },
    "shipping": {
        "good": ["ups", "fedex", "post office", "usps", "shipping"],
        "bad": ["restaurant", "coffee", "bar"],
    },
    "office_supplies": {
        "good": ["bookstore", "staples", "office depot", "target", "books"],
        "bad": ["restaurant", "coffee", "bar"],
    },
    "pharmacy": {
        "good": ["cvs", "walgreens", "pharmacy", "drug"],
        "bad": ["restaurant", "coffee", "bar"],
    },
    "groceries": {
        "good": ["safeway", "trader joe", "grocery", "market", "target"],
        "bad": ["restaurant", "coffee", "bar"],
    },
}


def score_candidate(candidate: dict) -> dict:
    distance = candidate.get("distance_miles", 999)
    category = candidate.get("category", "")
    display_name = candidate.get("display_name", "").lower()

    distance_score = max(0, 50 - (distance * 8))
    relevance_score = 25
    category_confidence = 50

    keywords = CATEGORY_KEYWORDS.get(category, {"good": [], "bad": []})

    if any(good in display_name for good in keywords["good"]):
        relevance_score += 25
        category_confidence += 35

    if any(bad in display_name for bad in keywords["bad"]):
        relevance_score -= 35
        category_confidence -= 40

    total_score = round(max(0, distance_score + relevance_score), 1)
    confidence = round(min(99, max(1, category_confidence + (distance_score / 2))), 1)

    candidate["score"] = total_score
    candidate["confidence"] = confidence
    candidate["score_explanation"] = [
        f"{distance} miles from start",
        "Matched requested category",
        f"{confidence}% confidence",
    ]

    return candidate


def rank_candidates(candidates: list[dict]) -> list[dict]:
    scored = [score_candidate(candidate) for candidate in candidates]
    return sorted(scored, key=lambda item: item["score"], reverse=True)


def choose_best_candidate(candidates: list[dict]):
    ranked = rank_candidates(candidates)

    if not ranked:
        return None

    return ranked[0]