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

const icons = ["🍽️", "☕", "🛍️", "📦", "📍"];

function shortAddress(address?: string) {
  if (!address) return "Location unavailable";
  return address.split(",").slice(0, 3).join(",");
}

export default function TimelinePanel({ stops }: Props) {
  return (
    <section className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-yellow-400">Smart timeline</p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Recommended route
          </h2>
        </div>

        <div className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-neutral-400">
          {stops.length} stops
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {stops.map((stop, index) => (
          <div key={`${stop.name}-${index}`} className="relative">
            {index !== stops.length - 1 && (
              <div className="absolute left-5 top-12 h-full w-px bg-neutral-800" />
            )}

            <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-lg">
                  {icons[index] || "📍"}
                </div>

                <div className="w-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                        Stop {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-white">
                        {stop.name}
                      </h3>
                    </div>

                    <div className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                      {stop.estimated_minutes} min
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-neutral-400">
                    {stop.reason}
                  </p>

                  {stop.selected_place && (
                    <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Recommended place
                      </p>

                      <h4 className="mt-2 text-base font-bold text-white">
                        {stop.selected_place.name}
                      </h4>

                      <p className="mt-1 text-sm text-neutral-400">
                        {shortAddress(stop.selected_place.display_name)}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Metric label="Score" value={`${Math.round(stop.selected_place.score)}`} />
                        <Metric label="Match" value={`${Math.round(stop.selected_place.confidence)}%`} />
                        <Metric label="Away" value={`${stop.selected_place.distance_miles} mi`} />
                      </div>
                    </div>
                  )}

                  {stop.alternatives && stop.alternatives.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        Alternatives
                      </p>

                      <div className="mt-2 grid gap-2">
                        {stop.alternatives.map((place, placeIndex) => (
                          <div
                            key={`${place.name}-${placeIndex}`}
                            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {place.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {place.distance_miles} mi away
                              </p>
                            </div>

                            <div className="rounded-full bg-neutral-950 px-3 py-1 text-xs text-neutral-300">
                              {Math.round(place.confidence)}% match
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}