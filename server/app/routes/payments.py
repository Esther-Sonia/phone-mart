from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/payments", tags=["Payments"])


class PaymentRequest(BaseModel):
    """Schema for M-Pesa payment request"""
    phone_number: str
    amount: float
    order_id: str


@router.post("/mpesa")
async def initiate_mpesa_payment(payment: PaymentRequest):
    """
    Initiate M-Pesa payment (STK Push)
    
    TODO: Implement M-Pesa Daraja API integration
    - Get access token
    - Initiate STK Push
    - Handle callback
    """
    # Placeholder for M-Pesa integration
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="M-Pesa integration coming soon"
    )


@router.post("/mpesa/callback")
async def mpesa_callback(callback_data: dict):
    """
    Handle M-Pesa payment callback
    
    TODO: Implement callback processing
    - Verify payment
    - Update order status
    - Send confirmation
    """
    # Placeholder for callback handling
    return {"status": "callback received"}