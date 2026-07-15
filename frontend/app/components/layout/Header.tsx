export default function Header() {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400 text-lg font-black text-black">
              M
            </div>

            <div>
              <p className="text-sm font-medium text-yellow-400">
                Maps: Goal Planner
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                AI Goal Planner
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300">
          OpenStreetMap + AI
        </div>
      </div>
    </header>
  );
}