COFFEE_KEYWORDS = [
    "starbucks",
    "peet",
    "temple coffee",
    "coffee",
    "cafe",
    "espresso",
    "roasters",
]

BAD_COFFEE_KEYWORDS = [
    "sushi",
    "bar and grill",
    "restaurant",
    "pizza",
    "burger",
    "taco",
]


def score_candidate(candidate: dict) -> dict:
    distance = candidate.get("distance_miles", 999)
    category = candidate.get("category", "")
    name = candidate.get("name", "").lower()
    display_name = candidate.get("display_name", "").lower()

    distance_score = max(0, 50 - (distance * 10))
    relevance_score = 35

    if category == "coffee":
        if any(bad in display_name for bad in BAD_COFFEE_KEYWORDS):
            relevance_score -= 40

        if any(good in display_name for good in COFFEE_KEYWORDS):
            relevance_score += 25

    total_score = round(max(0, distance_score + relevance_score), 1)

    candidate["score"] = total_score
    candidate["score_explanation"] = [
        f"{distance} miles from start",
        "Matches requested category",
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