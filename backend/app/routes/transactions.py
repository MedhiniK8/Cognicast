from fastapi import APIRouter
from ..models.schemas import TransactionCreate, TransactionResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

# In-memory store
transactions_db: list[dict] = []

CATEGORY_MAP = {
    "swiggy": "Food", "zomato": "Food", "restaurant": "Food", "food": "Food",
    "uber": "Transport", "ola": "Transport", "metro": "Transport",
    "amazon": "Shopping", "flipkart": "Shopping", "myntra": "Shopping",
    "netflix": "Subscriptions", "spotify": "Subscriptions",
    "electricity": "Utilities", "rent": "Utilities",
    "salary": "Salary", "freelance": "Salary",
}


def detect_category(description: str) -> str:
    lower = description.lower()
    for keyword, category in CATEGORY_MAP.items():
        if keyword in lower:
            return category
    return "Other"


@router.post("/")
async def create_transaction(txn: TransactionCreate):
    category = txn.category or detect_category(txn.description)
    new_txn = {
        "id": str(uuid.uuid4()),
        "account_id": txn.account_id,
        "date": datetime.utcnow(),
        "description": txn.description,
        "amount": txn.amount,
        "type": txn.type,
        "category": category,
    }
    transactions_db.append(new_txn)
    return new_txn


@router.get("/")
async def list_transactions(account_id: str = None):
    if account_id:
        return [t for t in transactions_db if t["account_id"] == account_id]
    return transactions_db
