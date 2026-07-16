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
  onSelectAlternative: (stopIndex: number, place: PlaceOption) => void;
};

const icons = ["🍽️", "☕", "🛍️", "📦", "📍"];

function shortAddress(address?: string) {
  if (!address) return "Location unavailable";
  return address.split(",").slice(0, 3).join(",");
}

function matchLabel(confidence: number) {
  if (confidence >= 95) return "Excellent match";
  if (confidence >= 85) return "Strong match";
  if (confidence >= 70) return "Good match";
  return "Backup option";
}

export default function TimelinePanel({ stops, onSelectAlternative }: Props) {
  return (
    <section className="rounded-[2rem] border border-[#2B3A33] bg-[#121C22]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
            Smart timeline
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#F4EFE6]">
            Recommended route
          </h2>
        </div>

        <div className="rounded-full border border-[#2F4038] bg-[#18252B] px-3 py-1 text-xs text-[#B8B0A3]">
          {stops.length} stops
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {stops.map((stop, index) => (
          <div key={`${stop.name}-${index}`} className="relative">
            {index !== stops.length - 1 && (
              <div className="absolute left-5 top-12 h-full w-px bg-[#2F4038]" />
            )}

            <div className="relative rounded-2xl border border-[#2F4038] bg-[#18252B] p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#3A5A40] text-lg">
                  {icons[index] || "📍"}
                </div>

                <div className="w-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#C89B3C]">
                        Stop {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[#F4EFE6]">
                        {stop.name}
                      </h3>
                    </div>

                    <div className="rounded-full bg-[#0B1116]/80 px-3 py-1 text-xs font-semibold text-[#D8D0C3]">
                      {stop.estimated_minutes} min
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#B8B0A3]">
                    {stop.reason}
                  </p>

                  {stop.selected_place && (
                    <div className="mt-4 rounded-2xl border border-[#2F4038] bg-[#0B1116]/70 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#8F877A]">
                            Selected place
                          </p>

                          <h4 className="mt-2 text-base font-bold text-[#F4EFE6]">
                            {stop.selected_place.name}
                          </h4>

                          <p className="mt-1 text-sm text-[#B8B0A3]">
                            {shortAddress(stop.selected_place.display_name)}
                          </p>
                        </div>

                        <div className="rounded-full bg-[#C89B3C] px-3 py-1 text-xs font-bold text-[#0B1116]">
                          {matchLabel(stop.selected_place.confidence)}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Metric
                          label="Distance"
                          value={`${stop.selected_place.distance_miles} mi`}
                        />
                        <Metric
                          label="Fit score"
                          value={`${Math.round(stop.selected_place.score)}/100`}
                        />
                      </div>
                    </div>
                  )}

                  {stop.alternatives && stop.alternatives.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8F877A]">
                        Alternatives
                      </p>

                      <div className="mt-2 grid gap-2">
                        {stop.alternatives.map((place, placeIndex) => (
                          <button
                            key={`${place.name}-${placeIndex}`}
                            onClick={() => onSelectAlternative(index, place)}
                            className="w-full rounded-xl border border-[#2F4038] bg-[#0B1116]/70 px-4 py-3 text-left transition hover:border-[#C89B3C]"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-[#F4EFE6]">
                                  {place.name}
                                </p>
                                <p className="mt-1 text-xs text-[#8F877A]">
                                  {shortAddress(place.display_name)}
                                </p>
                                <p className="mt-1 text-xs text-[#8F877A]">
                                  {place.distance_miles} mi away
                                </p>
                              </div>

                              <div className="rounded-full bg-[#18252B] px-3 py-1 text-xs text-[#D8D0C3]">
                                {matchLabel(place.confidence)}
                              </div>
                            </div>
                          </button>
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
    <div className="rounded-xl border border-[#2F4038] bg-[#18252B] p-3">
      <p className="text-[11px] uppercase tracking-wide text-[#8F877A]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#F4EFE6]">{value}</p>
    </div>
  );
}