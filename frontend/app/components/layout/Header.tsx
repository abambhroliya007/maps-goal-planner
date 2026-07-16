export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-xl font-black text-black shadow-lg shadow-yellow-400/20">
            M
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Maps: Goal Planner
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              AI Goal Planner
            </h1>
          </div>
        </div>

        <div className="hidden rounded-full border border-neutral-700 bg-neutral-900/80 px-4 py-2 text-sm text-neutral-300 md:block">
          OpenStreetMap · OpenAI · FastAPI
        </div>
      </div>
    </header>
  );
}