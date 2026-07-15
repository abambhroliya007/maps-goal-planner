"use client";

import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
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

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ stops, route }: Props) {
  const validStops = stops.filter((stop) => stop.lat && stop.lon);

  const center: [number, number] =
    validStops.length > 0
      ? [validStops[0].lat as number, validStops[0].lon as number]
      : [38.5816, -121.4944];

  const routePositions =
    route?.coordinates?.map((coord) => [coord[1], coord[0]] as [number, number]) ||
    [];

  return (
    <div className="h-full min-h-[650px] w-full overflow-hidden rounded-2xl">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validStops.map((stop, index) => (
          <Marker
            key={`${stop.name}-${index}`}
            position={[stop.lat as number, stop.lon as number]}
            icon={markerIcon}
          >
            <Popup>
              <strong>
                {index + 1}. {stop.name}
              </strong>
              <br />
              {stop.query}
            </Popup>
          </Marker>
        ))}

        {routePositions.length > 0 && <Polyline positions={routePositions} />}
      </MapContainer>
    </div>
  );
}