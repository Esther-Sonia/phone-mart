from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/payments", tags=["Payments"])


class PaymentRequest(BaseModel):
    phone_number: str
    amount: float
    order_id: str


@router.post("/mpesa")
async def initiate_mpesa_payment(payment: PaymentRequest):
  
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="M-Pesa integration coming soon"
    )


@router.post("/mpesa/callback")
async def mpesa_callback(callback_data: dict):
    
    return {"status": "callback received"}