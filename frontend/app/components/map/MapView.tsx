"use client";

import { useEffect } from "react";
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
        height: 34px;
        width: 34px;
        border-radius: 9999px;
        background: #facc15;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        border: 3px solid white;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      ">
        ${number}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function FitBounds({ stops }: { stops: Stop[] }) {
  const map = useMap();

  useEffect(() => {
    const validStops = stops.filter((stop) => stop.lat && stop.lon);

    if (validStops.length > 1) {
      const bounds = validStops.map(
        (stop) => [stop.lat as number, stop.lon as number] as [number, number]
      );

      map.fitBounds(bounds, {
        padding: [60, 60],
      });
    }
  }, [map, stops]);

  return null;
}

export default function MapView({ stops, route }: Props) {
  const validStops = stops.filter((stop) => stop.lat && stop.lon);

  const center: [number, number] =
    validStops.length > 0
      ? [validStops[0].lat as number, validStops[0].lon as number]
      : [38.5816, -121.4944];

  const routePositions =
    route?.coordinates?.map(
      (coord) => [coord[1], coord[0]] as [number, number]
    ) || [];

  return (
    <div className="h-full min-h-[650px] w-full overflow-hidden rounded-2xl">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stops={validStops} />

        {validStops.map((stop, index) => (
          <Marker
            key={`${stop.name}-${index}`}
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

        {routePositions.length > 0 && (
          <Polyline positions={routePositions} weight={5} color="#2563eb" />
        )}
      </MapContainer>
    </div>
  );
}