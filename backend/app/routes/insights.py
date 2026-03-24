from fastapi import APIRouter
from ..models.schemas import InsightRequest
from ..services.ai_insights_service import generate_ai_insights

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.post("/")
async def get_insights(request: InsightRequest):
    transactions = request.transactions
    total_income = sum(t["amount"] for t in transactions if t.get("type") == "credit")
    total_expenses = sum(t["amount"] for t in transactions if t.get("type") == "debit")

    categories = {}
    for t in transactions:
        if t.get("type") == "debit":
            cat = t.get("category", "Other")
            categories[cat] = categories.get(cat, 0) + t["amount"]

    summary = {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "categories": categories,
    }

    insights = await generate_ai_insights(summary, request.monthly_budget)
    return {"insights": insights}
