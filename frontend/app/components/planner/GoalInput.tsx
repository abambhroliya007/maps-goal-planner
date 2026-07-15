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
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 shadow-2xl">
      <div>
        <p className="text-sm font-medium text-yellow-400">AI Goal Planner</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          What do you need to accomplish?
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Describe your real-life goal. The AI will turn it into stops,
          timing, and a route.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm text-neutral-300">Starting location</label>
          <input
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-300">Goal</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-2 min-h-36 w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading}
          className="w-full rounded-xl bg-yellow-400 py-6 text-base font-semibold text-black hover:bg-yellow-300"
        >
          {loading ? "Planning your route..." : "Generate Goal Plan"}
        </Button>
      </div>
    </section>
  );
}