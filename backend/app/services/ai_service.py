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
      "label": "Buy golf balls",
      "category": "sporting_goods",
      "search_query": "golf balls",
      "estimated_minutes": 25,
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
- sporting_goods
- pet_store
- florist
- electronics_store
- home_improvement
- barbershop
- hair_salon
- golf_course
- gym
- park
- gas_station
- bank
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
- Always include search_query.
- search_query should preserve the actual item or task the user wants.
- If the user asks for golf balls, golf clubs, sports equipment, or athletic gear, use sporting_goods.
- If the user asks for printer ink, notebooks, paper, pens, or school supplies, use office_supplies.
- If the user asks for pet food or pet supplies, use pet_store.
- If the user asks for flowers, use florist.
- If the user asks for phone chargers, headphones, laptops, or electronics, use electronics_store.
- If the user asks for tools, paint, hardware, or apartment setup items, use home_improvement.
- If the user says Costco, use warehouse_store.
- If the user says haircut, use barbershop.
- If the user says golf or 18 holes, use golf_course.
- If the user says food, lunch, dinner, breakfast, or meal, use restaurant.
- Do not invent business names.
- Do not mention scores, ranking, algorithms, or APIs.
- Return only valid JSON.
"""

    response = client.responses.create(
        model=settings.openai_model,
        instructions=PLANNER_SYSTEM_PROMPT,
        input=user_prompt,
    )

    return json.loads(response.output_text)