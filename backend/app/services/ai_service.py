import json
from openai import OpenAI

from app.core.config import settings
from app.core.prompts import PLANNER_SYSTEM_PROMPT

client = OpenAI(api_key=settings.openai_api_key)


def generate_ai_plan(user_goal: str, start_location: str) -> dict:
    user_prompt = f"""
User goal:
{user_goal}

Starting location:
{start_location}

Extract the user's goal into structured trip-planning intent.

Return JSON in this exact structure:

{{
  "summary": "short, polished one-sentence summary of the plan",
  "intents": [
    {{
      "label": "Get a haircut",
      "category": "barbershop",
      "estimated_minutes": 45,
      "reason": "short user-facing reason, under 14 words"
    }}
  ],
  "total_estimated_minutes": 120,
  "reasoning": "polished explanation of the route order in 1-2 sentences"
}}

Allowed categories:
- coffee_shop
- restaurant
- grocery_store
- warehouse_store
- shipping
- pharmacy
- bookstore
- office_supplies
- barbershop
- hair_salon
- golf_course
- gym
- park
- gas_station
- bank
- electronics_store
- home_improvement
- clothing_store
- department_store
- car_wash
- doctor
- dentist
- urgent_care
- movie_theater
- museum
- hotel
- airport

Rules:
- Create 2 to 6 intents.
- Use only allowed categories.
- If the user says Costco, use warehouse_store.
- If the user says haircut, use barbershop.
- If the user says golf or 18 holes, use golf_course.
- If the user says food, lunch, dinner, or meal, use restaurant.
- Do not invent business names.
- Do not mention scores, ranking, algorithms, or APIs.
- Write reasons like a premium consumer app, not like a developer tool.
- Return only valid JSON.
"""

    response = client.responses.create(
        model=settings.openai_model,
        instructions=PLANNER_SYSTEM_PROMPT,
        input=user_prompt,
    )

    return json.loads(response.output_text)