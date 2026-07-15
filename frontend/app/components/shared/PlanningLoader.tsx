export default function PlanningLoader() {
  const steps = [
    "Understanding your goal",
    "Finding nearby places",
    "Ranking best options",
    "Optimizing route",
  ];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      <p className="text-sm font-medium text-yellow-400">
        AI is planning your route
      </p>

      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
              {index + 1}
            </div>

            <div>
              <p className="text-sm font-medium text-white">{step}</p>
              <div className="mt-2 h-1.5 w-64 overflow-hidden rounded-full bg-neutral-800">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-yellow-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}