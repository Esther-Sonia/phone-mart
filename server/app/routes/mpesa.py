import httpx
import base64
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import settings

router = APIRouter(prefix="/api/mpesa", tags=["mpesa"])

class STKPushRequest(BaseModel):
    phone: str
    amount: int

def get_access_token():
    credentials = base64.b64encode(
        f"{settings.CONSUMER_KEY}:{settings.CONSUMER_SECRET}".encode()
    ).decode()
    
    response = httpx.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {credentials}"}
    )
    return response.json()["access_token"]

def generate_password():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{settings.SHORTCODE}{settings.PASSKEY}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp

@router.post("/stk-push")
async def stk_push(payload: STKPushRequest):
    try:
        phone = payload.phone.replace("+", "")
        if phone.startswith("0"):
            phone = "254" + phone[1:]

        token = get_access_token()
        password, timestamp = generate_password()

        response = httpx.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "BusinessShortCode": settings.SHORTCODE,
                "Password": password,
                "Timestamp": timestamp,
                "Timeout":30.0,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": payload.amount,
                "PartyA": phone,
                "PartyB": settings.SHORTCODE,
                "PhoneNumber": phone,
                "CallBackURL": settings.CALLBACK_URL,
                "AccountReference": "PhoneMart",
                "TransactionDesc": "Phone purchase"
            }
        )
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))