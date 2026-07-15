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
  "summary": "short summary of the user's goal",
  "intents": [
    {{
      "label": "Coffee stop",
      "category": "coffee",
      "estimated_minutes": 15,
      "reason": "Why this stop is needed"
    }}
  ],
  "total_estimated_minutes": 120,
  "reasoning": "Explain the suggested order at a high level."
}}

Allowed categories:
- coffee
- food
- groceries
- shipping
- pharmacy
- office_supplies

Rules:
- Create 3 to 6 intents.
- Use only allowed categories.
- Do not create place names.
- Do not create search queries.
- Do not invent business names.
- The backend will find the actual nearby location.
- Return only valid JSON.
"""

    response = client.responses.create(
        model=settings.openai_model,
        instructions=PLANNER_SYSTEM_PROMPT,
        input=user_prompt,
    )

    return json.loads(response.output_text)