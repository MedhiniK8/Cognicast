from fastapi import APIRouter, HTTPException
from ..models.schemas import AccountCreate, AccountResponse
from ..config import get_settings
from datetime import datetime
import random
import uuid

router = APIRouter(prefix="/api/accounts", tags=["accounts"])

# In-memory store (replace with MongoDB in production)
accounts_db: dict[str, list[dict]] = {}


def generate_account_number():
    return " ".join(str(random.randint(1000, 9999)) for _ in range(4))


@router.post("/", response_model=AccountResponse)
async def create_account(account: AccountCreate, user_id: str = "demo-user"):
    new_account = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "name": account.name,
        "account_number": generate_account_number(),
        "balance": account.balance,
        "created_at": datetime.utcnow(),
    }
    if user_id not in accounts_db:
        accounts_db[user_id] = []
    accounts_db[user_id].append(new_account)
    return new_account


@router.get("/")
async def list_accounts(user_id: str = "demo-user"):
    return accounts_db.get(user_id, [])


@router.delete("/{account_id}")
async def delete_account(account_id: str, user_id: str = "demo-user"):
    user_accounts = accounts_db.get(user_id, [])
    accounts_db[user_id] = [a for a in user_accounts if a["id"] != account_id]
    return {"message": "Account deleted"}
