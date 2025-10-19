from fastapi import APIRouter, Request
import os, stripe

router = APIRouter(prefix="/billing", tags=["billing"])
stripe.api_key = os.getenv('STRIPE_SECRET')

@router.post('/create-portal')
async def create_portal():
    session = stripe.billing_portal.Session.create(customer_creation='if_required')
    return {"url": session.url}

@router.post('/webhook')
async def webhook(req: Request):
    payload = await req.body()
    # TODO: verify with STRIPE_WEBHOOK_SECRET and handle events
    return {"received": True}
