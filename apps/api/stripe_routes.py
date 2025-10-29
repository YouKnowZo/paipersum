import os
import stripe
from fastapi import HTTPException
from pydantic import BaseModel

# Initialize Stripe with your secret key
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class CheckoutSessionRequest(BaseModel):
    price_id: str
    customer_email: str
    success_url: str
    cancel_url: str

def create_checkout_session(data: CheckoutSessionRequest):
    """Create a Stripe checkout session for Pro subscription"""
    
    if not stripe.api_key:
        raise HTTPException(
            status_code=500, 
            detail="Stripe not configured. Set STRIPE_SECRET_KEY environment variable"
        )
    
    try:
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            customer_email=data.customer_email,
            payment_method_types=['card'],
            line_items=[{
                'price': data.price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=data.success_url,
            cancel_url=data.cancel_url,
            metadata={
                'product': 'PaiperSum Pro',
            }
        )
        
        return {'sessionId': session.id}
        
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checkout session creation failed: {str(e)}")


def handle_webhook(payload: bytes, sig_header: str):
    """Handle Stripe webhooks for subscription events"""
    
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")
    
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
        # TODO: Update user to Pro in database
        # For now, we'll just log it
        print(f"Payment successful for: {session.get('customer_email')}")
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # TODO: Downgrade user from Pro
        print(f"Subscription cancelled for: {subscription.get('customer')}")
    
    return {'status': 'success'}
