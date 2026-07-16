const steps = [
  {
    icon: "🧠",
    title: "Understanding your goal",
    description: "Extracting errands, constraints, and timing.",
  },
  {
    icon: "📍",
    title: "Searching nearby places",
    description: "Finding real locations around your starting point.",
  },
  {
    icon: "⭐",
    title: "Ranking candidates",
    description: "Scoring options by relevance, distance, and confidence.",
  },
  {
    icon: "🗺️",
    title: "Optimizing route",
    description: "Building the route and timeline.",
  },
];

export default function PlanningLoader() {
  return (
    <section className="rounded-[2rem] border border-neutral-800 bg-neutral-950/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
          AI is planning
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Building your goal route
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-lg">
                {step.icon}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm text-neutral-400">
                  {step.description}
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full animate-pulse rounded-full bg-yellow-400"
                    style={{ width: `${45 + index * 15}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}