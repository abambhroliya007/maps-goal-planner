export default function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div>
          <p className="text-sm font-medium text-yellow-400">
            Maps: Goal Planner
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Turn goals into optimized trips.
          </h1>
        </div>

        <div className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-400">
          AI Powered
        </div>
      </div>
    </header>
  );
}