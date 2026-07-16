"use client";

import { Button } from "@/components/ui/button";

type Props = {
  startLocation: string;
  setStartLocation: (value: string) => void;
  goal: string;
  setGoal: (value: string) => void;
  loading: boolean;
  onGenerate: () => void;
};

export default function GoalInput({
  startLocation,
  setStartLocation,
  goal,
  setGoal,
  loading,
  onGenerate,
}: Props) {
  return (
    <section className="rounded-[2rem] border border-neutral-800 bg-neutral-950/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
        <p className="text-sm font-medium text-yellow-400">Plan smarter</p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
          What do you need to get done?
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Describe your goal naturally. The planner finds places, ranks options,
          maps the route, and builds a timeline.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-neutral-300">
            Starting location
          </label>
          <input
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-neutral-800 bg-black/40 px-4 py-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            placeholder="Sacramento State, Sacramento, CA"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300">Goal</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-2 min-h-44 w-full resize-none rounded-2xl border border-neutral-800 bg-black/40 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            placeholder="I have 2 hours before class. I need lunch, coffee, notebooks, and to return a package."
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-yellow-400 text-base font-bold text-black shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 disabled:opacity-60"
        >
          {loading ? "Building your plan..." : "Generate Goal Plan"}
        </Button>
      </div>
    </section>
  );
}