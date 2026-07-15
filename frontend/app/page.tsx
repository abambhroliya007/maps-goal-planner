"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import Header from "./components/layout/Header";
import GoalInput from "./components/planner/GoalInput";
import PlanningPanel from "./components/planner/PlanningPanel";
import PlanningLoader from "./components/shared/PlanningLoader";
import TimelinePanel from "./components/timeline/TimelinePanel";

const MapView = dynamic(() => import("./components/map/MapView"), {
  ssr: false,
});

type Stop = {
  name: string;
  query: string;
  estimated_minutes: number;
  reason: string;
  lat?: number | null;
  lon?: number | null;
};

type PlanResponse = {
  summary: string;
  stops: Stop[];
  total_estimated_minutes: number;
  reasoning: string;
  route_geometry?: {
    type: string;
    coordinates: number[][];
  } | null;
  route_distance_meters?: number | null;
  route_duration_seconds?: number | null;
};

export default function Home() {
  const [startLocation, setStartLocation] = useState(
    "Sacramento State, Sacramento, CA"
  );

  const [goal, setGoal] = useState(
    "I have 2 hours before class. I need lunch, coffee, notebooks, and to return a package."
  );

  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_goal: goal,
          start_location: startLocation,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate plan");
      }

      const data: PlanResponse = await res.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Header />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[390px_1fr]">
        <GoalInput
          startLocation={startLocation}
          setStartLocation={setStartLocation}
          goal={goal}
          setGoal={setGoal}
          loading={loading}
          onGenerate={generatePlan}
        />

        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <MapView stops={plan?.stops || []} route={plan?.route_geometry} />
        </div>
      </section>

      {loading && (
        <section className="mx-auto max-w-7xl px-6 pb-10">
          <PlanningLoader />
        </section>
      )}

      {plan && (
        <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-2">
          <PlanningPanel plan={plan} stopCount={plan.stops.length} />
          <TimelinePanel stops={plan.stops} />
        </section>
      )}
    </main>
  );
}