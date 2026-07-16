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

function getFinishTime(totalMinutes: number) {
  const finish = new Date(Date.now() + totalMinutes * 60 * 1000);

  return finish.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PlanningPanel({ plan, stopCount }: Props) {
  const drivingMinutes = plan.route_duration_seconds
    ? Math.round(plan.route_duration_seconds / 60)
    : null;

  const distanceMiles = plan.route_distance_meters
    ? (plan.route_distance_meters / 1609).toFixed(1)
    : null;

  return (
    <section className="rounded-[2rem] border border-[#2B3A33] bg-[#121C22]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
        Goal understood
      </p>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F4EFE6]">
        {plan.summary}
      </h2>

      <div className="mt-6 rounded-2xl border border-[#2F4038] bg-[#18252B] p-5">
        <p className="text-sm font-semibold text-[#F4EFE6]">Route summary</p>

        <div className="mt-4 grid gap-3">
          <SummaryRow label="Stops" value={`${stopCount} planned stops`} />
          <SummaryRow label="Total plan" value={`${plan.total_estimated_minutes} minutes`} />
          <SummaryRow label="Driving" value={drivingMinutes ? `${drivingMinutes} minutes` : "Not available"} />
          <SummaryRow label="Distance" value={distanceMiles ? `${distanceMiles} miles` : "Not available"} />
          <SummaryRow label="Estimated finish" value={`Around ${getFinishTime(plan.total_estimated_minutes)}`} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#2F4038] bg-[#18252B] p-5">
        <p className="text-sm font-semibold text-[#F4EFE6]">Why this plan?</p>
        <p className="mt-3 text-sm leading-6 text-[#B8B0A3]">
          {plan.reasoning}
        </p>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#2F4038] bg-[#0B1116]/70 px-4 py-3">
      <p className="text-sm text-[#B8B0A3]">{label}</p>
      <p className="text-sm font-semibold text-[#F4EFE6]">{value}</p>
    </div>
  );
}