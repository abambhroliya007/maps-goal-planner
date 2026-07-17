"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Stop = {
  name: string;
  query: string;
  estimated_minutes: number;
  reason: string;
  lat?: number | null;
  lon?: number | null;
};

type RouteGeometry = {
  type: string;
  coordinates: number[][];
};

type Props = {
  stops: Stop[];
  route?: RouteGeometry | null;
};

function createWaypointIcon(label: string, type: "start" | "stop" = "stop") {
  const bg = type === "start" ? "#C89B3C" : "#3A5A40";
  const color = type === "start" ? "#0F1720" : "#F4EFE6";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        height: 42px;
        width: 42px;
        border-radius: 9999px;
        background: ${bg};
        color: ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 14px;
        border: 3px solid #F4EFE6;
        box-shadow: 0 14px 30px rgba(0,0,0,0.45);
      ">
        ${label}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

function FitBounds({
  positions,
  center,
}: {
  positions: [number, number][];
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    if (positions.length >= 2) {
      map.fitBounds(positions, {
        padding: [90, 90],
        maxZoom: 14,
        animate: true,
      });
      return;
    }

    map.setView(center, 13);
  }, [map, positions, center]);

  return null;
}

export default function MapView({ stops, route }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);

  const validStops = stops.filter(
    (stop) => typeof stop.lat === "number" && typeof stop.lon === "number"
  );

  const routePositions = useMemo(() => {
    return (
      route?.coordinates?.map(
        (coord) => [coord[1], coord[0]] as [number, number]
      ) || []
    );
  }, [route]);

  const startPosition: [number, number] | null =
    routePositions.length > 0 ? routePositions[0] : null;

  const stopPositions = validStops.map(
    (stop) => [stop.lat as number, stop.lon as number] as [number, number]
  );

  const allMapPositions = [
    ...(startPosition ? [startPosition] : []),
    ...stopPositions,
  ];

  const center: [number, number] =
    startPosition ||
    (validStops.length > 0
      ? [validStops[0].lat as number, validStops[0].lon as number]
      : [38.5816, -121.4944]);

  const animatedRoutePositions = useMemo(() => {
    if (routePositions.length === 0) return [];

    const visiblePoints = Math.max(
      2,
      Math.floor((routeProgress / 100) * routePositions.length)
    );

    return routePositions.slice(0, visiblePoints);
  }, [routePositions, routeProgress]);

  useEffect(() => {
    setVisibleCount(0);

    validStops.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCount(index + 1);
      }, index * 300);
    });
  }, [stops]);

  useEffect(() => {
    setRouteProgress(0);

    if (routePositions.length === 0) return;

    const interval = setInterval(() => {
      setRouteProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }

        return current + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [routePositions]);

  const visibleStops = validStops.slice(0, visibleCount);

  return (
    <div className="h-full min-h-[720px] w-full overflow-hidden rounded-[2rem]">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds positions={allMapPositions} center={center} />

        {animatedRoutePositions.length > 1 && (
          <>
            <Polyline
              positions={animatedRoutePositions}
              weight={10}
              color="#C89B3C"
              opacity={0.35}
            />
            <Polyline
              positions={animatedRoutePositions}
              weight={5}
              color="#3A5A40"
              opacity={0.95}
            />
          </>
        )}

        {startPosition && (
          <Marker
            position={startPosition}
            icon={createWaypointIcon("S", "start")}
          >
            <Popup>
              <strong>Start</strong>
              <br />
              Starting location
            </Popup>
          </Marker>
        )}

        {visibleStops.map((stop, index) => (
          <Marker
            key={`${stop.name}-${index}-${stop.lat}-${stop.lon}`}
            position={[stop.lat as number, stop.lon as number]}
            icon={createWaypointIcon(String(index + 1), "stop")}
          >
            <Popup>
              <strong>
                Stop {index + 1}: {stop.name}
              </strong>
              <br />
              {stop.query.split(",").slice(0, 3).join(",")}
              <br />
              <span>{stop.estimated_minutes} min planned</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}