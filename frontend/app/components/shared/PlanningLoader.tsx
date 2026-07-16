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
    <section className="rounded-[2rem] border border-[#2B3A33] bg-[#121C22]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
          AI is planning
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#F4EFE6]">
          Building your goal route
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-[#2F4038] bg-[#18252B] p-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3A5A40] text-lg">
                {step.icon}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-[#F4EFE6]">{step.title}</p>
                <p className="mt-1 text-sm text-[#B8B0A3]">
                  {step.description}
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0B1116]">
                  <div
                    className="h-full animate-pulse rounded-full bg-[#C89B3C]"
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