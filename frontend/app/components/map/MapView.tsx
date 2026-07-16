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

function createNumberedIcon(number: number) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        height: 38px;
        width: 38px;
        border-radius: 9999px;
        background: #3A5A40;
        color: #F4EFE6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        border: 3px solid #C89B3C;
        box-shadow: 0 14px 30px rgba(0,0,0,0.45);
      ">
        ${number}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

function FitBounds({ stops }: { stops: Stop[] }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    const validStops = stops.filter((stop) => stop.lat && stop.lon);

    if (validStops.length > 1) {
      const bounds = validStops.map(
        (stop) => [stop.lat as number, stop.lon as number] as [number, number]
      );

      map.fitBounds(bounds, {
        padding: [90, 90],
        animate: true,
      });
    } else if (validStops.length === 1) {
      map.setView(
        [validStops[0].lat as number, validStops[0].lon as number],
        14
      );
    }
  }, [map, stops]);

  return null;
}

export default function MapView({ stops, route }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);

  const validStops = stops.filter((stop) => stop.lat && stop.lon);

  const routePositions = useMemo(() => {
    return (
      route?.coordinates?.map(
        (coord) => [coord[1], coord[0]] as [number, number]
      ) || []
    );
  }, [route]);

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

  const center: [number, number] =
    validStops.length > 0
      ? [validStops[0].lat as number, validStops[0].lon as number]
      : [38.5816, -121.4944];

  const visibleStops = validStops.slice(0, visibleCount);

  return (
    <div className="h-full min-h-[720px] w-full overflow-hidden rounded-[2rem]">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stops={validStops} />

        {animatedRoutePositions.length > 0 && (
          <Polyline
            positions={animatedRoutePositions}
            weight={6}
            color="#3A5A40"
          />
        )}

        {visibleStops.map((stop, index) => (
          <Marker
            key={`${stop.name}-${index}-${stop.lat}-${stop.lon}`}
            position={[stop.lat as number, stop.lon as number]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              <strong>
                {index + 1}. {stop.name}
              </strong>
              <br />
              {stop.query.split(",").slice(0, 3).join(",")}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}