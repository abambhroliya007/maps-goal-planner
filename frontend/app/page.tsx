"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { apiPost } from "./lib/api";
import Header from "./components/layout/Header";
import GoalInput from "./components/planner/GoalInput";
import PlanningPanel from "./components/planner/PlanningPanel";
import PlanningLoader from "./components/shared/PlanningLoader";
import TimelinePanel from "./components/timeline/TimelinePanel";

const MapView = dynamic(() => import("./components/map/MapView"), {
  ssr: false,
});

type PlaceOption = {
  name: string;
  display_name: string;
  lat: number;
  lon: number;
  distance_miles: number;
  score: number;
  confidence: number;
};

type Stop = {
  name: string;
  query: string;
  estimated_minutes: number;
  reason: string;
  lat?: number | null;
  lon?: number | null;
  selected_place?: PlaceOption | null;
  alternatives?: PlaceOption[];
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

type RouteResponse = {
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
      const data = await apiPost<
        PlanResponse,
        { user_goal: string; start_location: string }
      >("/api/v1/plan", {
        user_goal: goal,
        start_location: startLocation,
      });

      setPlan(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectAlternative(stopIndex: number, place: PlaceOption) {
    if (!plan) return;

    const updatedStops = plan.stops.map((stop, index) => {
      if (index !== stopIndex) return stop;

      const currentSelected = stop.selected_place;
      const newAlternatives = [
        ...(currentSelected ? [currentSelected] : []),
        ...(stop.alternatives || []).filter(
          (alternative) => alternative.display_name !== place.display_name
        ),
      ];

      return {
        ...stop,
        query: place.display_name,
        lat: place.lat,
        lon: place.lon,
        selected_place: place,
        alternatives: newAlternatives,
      };
    });

    const routePoints = updatedStops
      .filter((stop) => stop.lat && stop.lon)
      .map((stop) => ({
        lat: stop.lat as number,
        lon: stop.lon as number,
      }));

    try {
      const routeData = await apiPost<
        RouteResponse,
        { points: { lat: number; lon: number }[] }
      >("/api/v1/route", {
        points: routePoints,
      });

      setPlan({
        ...plan,
        stops: updatedStops,
        route_geometry: routeData.route_geometry,
        route_distance_meters: routeData.route_distance_meters,
        route_duration_seconds: routeData.route_duration_seconds,
      });
    } catch (error) {
      console.error(error);
      setPlan({
        ...plan,
        stops: updatedStops,
      });
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#262626_0%,#0a0a0a_42%,#050505_100%)] text-white">
      <Header />

      <section className="mx-auto grid max-w-[1500px] gap-6 px-6 py-6 xl:grid-cols-[420px_1fr]">
        <div className="z-10">
          <GoalInput
            startLocation={startLocation}
            setStartLocation={setStartLocation}
            goal={goal}
            setGoal={setGoal}
            loading={loading}
            onGenerate={generatePlan}
          />

          {loading && (
            <div className="mt-6">
              <PlanningLoader />
            </div>
          )}
        </div>

        <div className="min-h-[720px] overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/40">
          <MapView stops={plan?.stops || []} route={plan?.route_geometry} />
        </div>
      </section>

      {plan && (
        <section className="mx-auto grid max-w-[1500px] gap-6 px-6 pb-10 xl:grid-cols-[0.8fr_1.2fr]">
          <PlanningPanel plan={plan} stopCount={plan.stops.length} />
          <TimelinePanel
            stops={plan.stops}
            onSelectAlternative={handleSelectAlternative}
          />
        </section>
      )}
    </main>
  );
}