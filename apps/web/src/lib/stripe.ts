import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY
    if (!key) {
      console.error('Missing VITE_STRIPE_PUBLIC_KEY environment variable')
      return null
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

export const createCheckoutSession = async (priceId: string, userEmail: string) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  
  try {
    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: priceId,
        customer_email: userEmail,
        success_url: `${window.location.origin}?success=true`,
        cancel_url: `${window.location.origin}?canceled=true`,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }
    
    const { sessionId } = await response.json()
    
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }
    
    // @ts-expect-error - Stripe types may not include redirectToCheckout
    const { error } = await stripe.redirectToCheckout({ sessionId })
    
    if (error) {
      throw error
    }
  } catch (err) {
    console.error('Checkout error:', err)
    throw err
  }
}
