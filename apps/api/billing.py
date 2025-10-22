import os
import stripe
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from database import get_db, User
from auth import get_current_user
import logging

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

router = APIRouter(prefix="/billing", tags=["billing"])

class CreateCheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

class CreatePortalSessionRequest(BaseModel):
    return_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CreateCheckoutSessionRequest,
    current_user: User = Depends(get_current_user)
):
    """Create Stripe checkout session for subscription"""
    try:
        checkout_session = stripe.checkout.Session.create(
            customer_email=current_user.email,
            payment_method_types=['card'],
            line_items=[{
                'price': request.price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={
                'user_id': str(current_user.id)
            }
        )
        
        return {"checkout_url": checkout_session.url}
    
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Checkout session error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@router.post("/create-portal-session")
async def create_portal_session(
    request: CreatePortalSessionRequest,
    current_user: User = Depends(get_current_user)
):
    """Create Stripe customer portal session"""
    try:
        # Get or create Stripe customer
        customers = stripe.Customer.list(email=current_user.email, limit=1)
        if customers.data:
            customer = customers.data[0]
        else:
            customer = stripe.Customer.create(
                email=current_user.email,
                metadata={'user_id': str(current_user.id)}
            )
        
        portal_session = stripe.billing_portal.Session.create(
            customer=customer.id,
            return_url=request.return_url,
        )
        
        return {"portal_url": portal_session.url}
    
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Portal session error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create portal session")

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata'].get('user_id')
        if user_id:
            # Update user subscription status
            logger.info(f"Subscription created for user {user_id}")
    
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        # Handle subscription updates
        logger.info(f"Subscription updated: {subscription['id']}")
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # Handle subscription cancellation
        logger.info(f"Subscription cancelled: {subscription['id']}")
    
    return {"status": "success"}

@router.get("/prices")
async def get_prices():
    """Get available subscription prices"""
    try:
        prices = stripe.Price.list(active=True, expand=['data.product'])
        return {"prices": prices.data}
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))