import google.generativeai as genai
from ..config import get_settings
import json


async def generate_ai_insights(transactions_summary: dict, monthly_budget: float) -> list[dict]:
    """Generate AI-powered financial insights using Gemini API."""
    settings = get_settings()

    if not settings.gemini_api_key:
        return _generate_fallback_insights(transactions_summary, monthly_budget)

    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = f"""You are a financial advisor analyzing spending patterns. 
Given this transaction summary, provide 5-8 concise financial insights.

Transaction Summary:
- Total Income: ₹{transactions_summary.get('total_income', 0):,.0f}
- Total Expenses: ₹{transactions_summary.get('total_expenses', 0):,.0f}
- Monthly Budget: ₹{monthly_budget:,.0f}
- Category Breakdown: {json.dumps(transactions_summary.get('categories', {}), indent=2)}
- Month-over-month change: {transactions_summary.get('mom_change', 'N/A')}

Return a JSON array of objects with fields:
- "type": one of "success", "warning", "danger", "info"
- "icon": an emoji icon
- "text": the insight text (1-2 sentences, use ₹ for currency)

Only return the JSON array, nothing else."""

        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown code blocks if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        insights = json.loads(text)
        return insights

    except Exception as e:
        print(f"Gemini API error: {e}")
        return _generate_fallback_insights(transactions_summary, monthly_budget)


def _generate_fallback_insights(summary: dict, budget: float) -> list[dict]:
    """Rule-based fallback when AI is unavailable."""
    insights = []
    income = summary.get("total_income", 0)
    expenses = summary.get("total_expenses", 0)
    categories = summary.get("categories", {})

    if expenses > budget:
        usage = (expenses / budget * 100) if budget > 0 else 0
        insights.append({
            "type": "danger",
            "icon": "🚨",
            "text": f"You've used {usage:.0f}% of your monthly budget!"
        })

    if income > 0:
        savings_rate = ((income - expenses) / income * 100)
        if savings_rate > 30:
            insights.append({
                "type": "success",
                "icon": "💪",
                "text": f"Great savings rate of {savings_rate:.0f}%! Keep it up."
            })
        elif savings_rate < 10:
            insights.append({
                "type": "danger",
                "icon": "💸",
                "text": f"Savings rate is only {savings_rate:.0f}%. Consider reducing expenses."
            })

    sorted_cats = sorted(categories.items(), key=lambda x: x[1], reverse=True)
    if sorted_cats:
        top = sorted_cats[0]
        insights.append({
            "type": "info",
            "icon": "🏷️",
            "text": f"Highest spending: {top[0]} at ₹{top[1]:,.0f}."
        })

    return insights
