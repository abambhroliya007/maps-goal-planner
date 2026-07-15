type PlaceOption = {
  name: string;
  display_name: string;
  lat: number;
  lon: number;
  distance_miles: number;
  score: number;
  confidence: number;
};

type Stop = {
  name: string;
  query: string;
  estimated_minutes: number;
  reason: string;
  lat?: number | null;
  lon?: number | null;
  selected_place?: PlaceOption | null;
  alternatives?: PlaceOption[];
};

type Props = {
  stops: Stop[];
};

function shortAddress(address?: string) {
  if (!address) return "Location unavailable";
  return address.split(",").slice(0, 3).join(",");
}

export default function TimelinePanel({ stops }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
      <p className="text-sm font-medium text-yellow-400">Timeline</p>

      <div className="mt-5 space-y-4">
        {stops.map((stop, index) => (
          <div
            key={`${stop.name}-${index}`}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-yellow-400">Stop {index + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {stop.name}
                </h3>
              </div>

              <div className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                {stop.estimated_minutes} min
              </div>
            </div>

            <p className="mt-3 text-sm text-neutral-300">{stop.reason}</p>

            {stop.selected_place && (
              <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Recommended
                </p>

                <h4 className="mt-1 font-semibold text-white">
                  {stop.selected_place.name}
                </h4>

                <p className="mt-1 text-sm text-neutral-400">
                  {shortAddress(stop.selected_place.display_name)}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Metric
                    label="Score"
                    value={`${Math.round(stop.selected_place.score)}`}
                  />
                  <Metric
                    label="Confidence"
                    value={`${Math.round(stop.selected_place.confidence)}%`}
                  />
                  <Metric
                    label="Distance"
                    value={`${stop.selected_place.distance_miles} mi`}
                  />
                </div>
              </div>
            )}

            {stop.alternatives && stop.alternatives.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Alternatives
                </p>

                <div className="mt-2 space-y-2">
                  {stop.alternatives.map((place, placeIndex) => (
                    <div
                      key={`${place.name}-${placeIndex}`}
                      className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {place.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {place.distance_miles} mi away
                        </p>
                      </div>

                      <p className="text-xs text-neutral-400">
                        {Math.round(place.confidence)}% match
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-900 p-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}