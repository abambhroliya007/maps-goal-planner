import requests


def get_route(points: list[dict]):
    if len(points) < 2:
        return None

    coordinates = ";".join(
        [f"{point['lon']},{point['lat']}" for point in points]
    )

    url = f"https://router.project-osrm.org/route/v1/driving/{coordinates}"

    params = {
        "overview": "full",
        "geometries": "geojson",
    }

    response = requests.get(url, params=params, timeout=10)

    if response.status_code != 200:
        return None

    data = response.json()

    if not data.get("routes"):
        return None

    route = data["routes"][0]

    return {
        "distance_meters": route["distance"],
        "duration_seconds": route["duration"],
        "geometry": route["geometry"],
    }