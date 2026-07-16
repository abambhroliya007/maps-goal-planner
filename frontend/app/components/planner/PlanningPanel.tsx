type PlanResponse = {
  summary: string;
  total_estimated_minutes: number;
  reasoning: string;
  route_distance_meters?: number | null;
  route_duration_seconds?: number | null;
};

type Props = {
  plan: PlanResponse;
  stopCount: number;
};

export default function PlanningPanel({ plan, stopCount }: Props) {
  const drivingMinutes = plan.route_duration_seconds
    ? Math.round(plan.route_duration_seconds / 60)
    : null;

  const distanceMiles = plan.route_distance_meters
    ? (plan.route_distance_meters / 1609).toFixed(1)
    : null;

  return (
    <section className="rounded-[2rem] border border-neutral-800 bg-neutral-950/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
        Goal understood
      </p>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
        {plan.summary}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric label="Stops" value={`${stopCount}`} />
        <Metric label="Plan time" value={`${plan.total_estimated_minutes} min`} />
        <Metric label="Driving" value={drivingMinutes ? `${drivingMinutes} min` : "N/A"} />
        <Metric label="Distance" value={distanceMiles ? `${distanceMiles} mi` : "N/A"} />
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
        <p className="text-sm font-semibold text-white">Why this plan?</p>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          {plan.reasoning}
        </p>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
    </div>
  );
}