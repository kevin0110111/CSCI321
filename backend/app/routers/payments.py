from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud
import stripe
import os

router = APIRouter(tags=["payments"])

# 设置Stripe API密钥
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # 在生产环境中使用环境变量

@router.post("/create-payment-intent")
async def create_payment_intent(account_id: int, db: Session = Depends(get_db)):
    """创建支付意向"""
    try:
        # 创建支付意向，金额为2000美分 ($20.00)
        intent = stripe.PaymentIntent.create(
            amount=2000,  # 金额以分为单位
            currency='usd',
            metadata={"account_id": str(account_id)},  # 存储用户ID以便webhook使用
            description="Premium subscription for Tassel AI"
        )
        
        return {"clientSecret": intent.client_secret}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """处理Stripe的webhook回调"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        # 验证webhook签名
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        
        # 处理支付成功事件
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            account_id = int(payment_intent["metadata"]["account_id"])
            
            # 更新用户为Premium状态，并设置一个月后的过期日期
            crud.update_account_premium_status(db, account_id=account_id, is_premium=True)
            
        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))