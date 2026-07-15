type Stop = {
  name: string;
  query: string;
  estimated_minutes: number;
  reason: string;
  lat?: number | null;
  lon?: number | null;
};

type Props = {
  stops: Stop[];
};

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
            <p className="text-sm text-yellow-400">Stop {index + 1}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {stop.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-400">
  {stop.query.split(",").slice(0, 3).join(",")}
</p>
            <p className="mt-3 text-sm text-neutral-300">{stop.reason}</p>
            <p className="mt-3 text-sm text-neutral-500">
              Estimated stop time: {stop.estimated_minutes} min
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}