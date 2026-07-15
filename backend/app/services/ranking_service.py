def score_candidate(candidate: dict) -> dict:
    distance = candidate.get("distance_miles", 999)

    distance_score = max(0, 50 - (distance * 10))
    relevance_score = 35

    total_score = round(distance_score + relevance_score, 1)

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