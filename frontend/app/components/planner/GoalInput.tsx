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
    <section className="rounded-[2rem] border border-[#2B3A33] bg-[#121C22]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="rounded-2xl border border-[#2F4038] bg-[#18252B] p-4">
        <p className="text-sm font-medium text-[#C89B3C]">Plan smarter</p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#F4EFE6]">
          What do you need to get done?
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#B8B0A3]">
          Enter an exact starting address, then describe your goal. The planner
          finds nearby places, ranks options, maps the route, and builds a
          timeline.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-[#D8D0C3]">
            Starting address or location
          </label>
          <input
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#2F4038] bg-[#0B1116]/70 px-4 py-4 text-sm text-[#F4EFE6] outline-none transition placeholder:text-[#716B62] focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20"
            placeholder="123 Main St, Sacramento, CA"
          />
          <p className="mt-2 text-xs text-[#8F877A]">
            You can use a home address, campus, hotel, office, or city.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-[#D8D0C3]">Goal</label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-2 min-h-44 w-full resize-none rounded-2xl border border-[#2F4038] bg-[#0B1116]/70 px-4 py-4 text-sm leading-6 text-[#F4EFE6] outline-none transition placeholder:text-[#716B62] focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20"
            placeholder="I have 2 hours. I need lunch, coffee, notebooks, and to return a package."
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-[#3A5A40] text-base font-bold text-[#F4EFE6] shadow-lg shadow-black/30 hover:bg-[#4F6F52] disabled:opacity-60"
        >
          {loading ? "Building your plan..." : "Generate Closest Route"}
        </Button>
      </div>
    </section>
  );
}