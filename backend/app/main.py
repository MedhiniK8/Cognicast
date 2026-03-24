from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import accounts, transactions, insights

app = FastAPI(
    title="FinSight AI",
    description="Multi-Bank Intelligent Financial Dashboard API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(insights.router)


@app.get("/")
async def root():
    return {
        "app": "FinSight AI",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
