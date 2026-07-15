# Maps: Goal Planner

An AI-powered goal-based trip planner that turns real-life goals into optimized routes, ranked place recommendations, timelines, and explainable decisions.

## What it does

Instead of searching one destination at a time, users describe a goal:

> I have 2 hours before class. I need lunch, coffee, notebooks, and to return a package.

The app generates:

- Recommended stops
- Ranked alternatives
- Confidence scores
- Route distance and driving time
- Timeline
- Interactive map with numbered pins

## Tech Stack

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Leaflet
- OpenStreetMap

Backend:
- FastAPI
- OpenAI API
- Nominatim
- OSRM

## Core AI Flow

User Goal  
→ Intent Extraction  
→ Nearby Place Search  
→ Candidate Ranking  
→ Route Optimization  
→ Timeline + Explanation

## Disclaimer

This is an independent educational portfolio project. It is not affiliated with or endorsed by Google, Google Maps, OpenStreetMap, or any mapping company.