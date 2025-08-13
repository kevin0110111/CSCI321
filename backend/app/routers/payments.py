from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud
import stripe
import os

router = APIRouter(tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  

@router.post("/create-payment-intent")
async def create_payment_intent(account_id: int, db: Session = Depends(get_db)):
    try:
        
        intent = stripe.PaymentIntent.create(
            amount=2000,  
            currency='usd',
            metadata={"account_id": str(account_id)},  
            description="Premium subscription for Tassel AI"
        )
        
        return {"clientSecret": intent.client_secret}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-checkout-session")
async def create_checkout_session(account_id: int, db: Session = Depends(get_db)):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Premium Subscription',
                        'description': 'One month premium access to Tassel AI',
                    },
                    'unit_amount': 2000,  # $20.00
                },
                'quantity': 1,
            }],
            metadata={
                'account_id': str(account_id)
            },
            mode='payment',
            success_url='https://csci321.onrender.com/user/subscription',  
            cancel_url='https://csci321.onrender.com/user/subscription',  
        )
        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """处理Stripe的webhook回调"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        
        
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            account_id = int(payment_intent["metadata"]["account_id"])
            
            
            crud.update_account_premium_status(db, account_id=account_id, is_premium=True)
            
        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))