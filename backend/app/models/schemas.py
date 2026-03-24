from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AccountCreate(BaseModel):
    name: str = Field(..., description="Bank name (e.g., SBI, HDFC)")
    balance: float = Field(..., ge=0, description="Initial balance")


class AccountResponse(BaseModel):
    id: str
    user_id: str
    name: str
    account_number: str
    balance: float
    created_at: datetime


class TransactionCreate(BaseModel):
    account_id: str
    description: str
    amount: float = Field(..., gt=0)
    type: str = Field(..., pattern="^(debit|credit)$")
    category: Optional[str] = None


class TransactionResponse(BaseModel):
    id: str
    account_id: str
    date: datetime
    description: str
    amount: float
    type: str
    category: str


class InsightRequest(BaseModel):
    transactions: list[dict]
    monthly_budget: float = 30000


class InsightResponse(BaseModel):
    insights: list[dict]
    health_score: dict
    anomalies: list[dict]
