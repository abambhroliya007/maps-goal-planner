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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
      <p className="text-sm font-medium text-yellow-400">Goal understood</p>

      <h2 className="mt-2 text-2xl font-semibold text-white">
        {plan.summary}
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Stops" value={`${stopCount}`} />
        <Metric label="Estimated time" value={`${plan.total_estimated_minutes} min`} />
        <Metric label="Driving time" value={drivingMinutes ? `${drivingMinutes} min` : "N/A"} />
        <Metric label="Distance" value={distanceMiles ? `${distanceMiles} mi` : "N/A"} />
      </div>

      <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm font-medium text-white">Why this plan?</p>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          {plan.reasoning}
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-900 p-4">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}