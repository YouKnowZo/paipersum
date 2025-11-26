import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface PricingTier {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

const tiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out PaiperSum',
    features: [
      '10 analyses per month',
      'All document types supported',
      'Basic risk assessment',
      'Email support',
      'Web access'
    ],
    cta: 'Get Started Free'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 19,
    period: 'month',
    description: 'For individuals and small teams',
    features: [
      'Unlimited analyses',
      'All document types',
      'Advanced AI insights',
      'Priority support (24h)',
      'Export to PDF',
      'API access',
      'Document history (unlimited)',
      'Custom templates',
      'Mobile app access'
    ],
    highlighted: true,
    cta: 'Start Pro Trial'
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    period: 'month',
    description: 'For growing businesses and teams',
    features: [
      'Everything in Pro',
      'Team collaboration (5 seats)',
      'Admin dashboard',
      'Custom branding',
      'Advanced security',
      'SSO integration',
      'Dedicated account manager',
      'SLA guarantee (99.9%)',
      'Custom integrations',
      'Training & onboarding'
    ],
    cta: 'Contact Sales'
  }
]

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      window.location.href = '/signup'
      return
    }

    if (tierId === 'business') {
      window.location.href = 'mailto:sales@paipersum.com?subject=Business Plan Inquiry'
      return
    }

    setLoading(tierId)
    try {
      // Create Stripe checkout session
      const response = await axios.post(`${API_URL}/create-checkout-session`, {
        price_id: billingPeriod === 'yearly' ? 'price_yearly' : 'price_monthly',
        success_url: window.location.origin + '/success',
        cancel_url: window.location.origin + '/pricing'
      })

      // Redirect to Stripe Checkout
      window.location.href = response.data.url
    } catch (error) {
      alert('Failed to start checkout. Please try again.')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const getPrice = (tier: PricingTier) => {
    if (tier.price === 0) return tier.price
    if (billingPeriod === 'yearly') {
      return Math.floor(tier.price * 10) // 2 months free
    }
    return tier.price
  }

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Choose the plan that's right for you. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-slate-200 rounded-xl">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-8 ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl scale-105 border-4 border-yellow-400'
                  : 'bg-white border-2 border-slate-200'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-slate-900 rounded-full text-sm font-bold">
                  🔥 Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  tier.highlighted ? 'text-white' : 'text-slate-900'
                }`}>
                  {tier.name}
                </h3>
                <p className={`text-sm ${
                  tier.highlighted ? 'text-blue-100' : 'text-slate-600'
                }`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${
                    tier.highlighted ? 'text-white' : 'text-slate-900'
                  }`}>
                    ${getPrice(tier)}
                  </span>
                  <span className={`text-lg ${
                    tier.highlighted ? 'text-blue-100' : 'text-slate-600'
                  }`}>
                    /{billingPeriod === 'yearly' ? 'year' : tier.period}
                  </span>
                </div>
                {billingPeriod === 'yearly' && tier.price > 0 && (
                  <p className={`text-sm mt-2 ${
                    tier.highlighted ? 'text-blue-100' : 'text-slate-600'
                  }`}>
                    ${tier.price}/mo billed annually
                  </p>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={loading === tier.id}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-6 ${
                  tier.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === tier.id ? 'Loading...' : tier.cta}
              </button>

              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className={`w-6 h-6 flex-shrink-0 ${
                        tier.highlighted ? 'text-yellow-400' : 'text-green-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-sm ${
                      tier.highlighted ? 'text-blue-50' : 'text-slate-700'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-10">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <FAQItem
              question="Can I try Pro for free?"
              answer="Yes! Start with the Free plan (10 analyses/month). Upgrade to Pro anytime for unlimited analyses."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, debit cards, and digital wallets via Stripe (Visa, Mastercard, Amex, Apple Pay, Google Pay)."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely! Cancel anytime from your account dashboard. No questions asked, no cancellation fees. You'll retain access until the end of your billing period."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes. We use bank-level encryption (AES-256), SOC 2 compliance, and never sell your data. Documents are processed securely and deleted after 90 days."
            />
            <FAQItem
              question="Do you offer enterprise plans?"
              answer="Yes! Contact sales@paipersum.com for custom enterprise plans with dedicated support, SLA guarantees, and custom features."
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 text-center">
          <p className="text-sm text-slate-600 mb-6">Trusted by 1M+ users worldwide</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="px-6 py-3 bg-white rounded-lg border-2 border-slate-200">
              🔒 256-bit SSL
            </div>
            <div className="px-6 py-3 bg-white rounded-lg border-2 border-slate-200">
              ✅ GDPR Compliant
            </div>
            <div className="px-6 py-3 bg-white rounded-lg border-2 border-slate-200">
              🛡️ SOC 2 Type II
            </div>
            <div className="px-6 py-3 bg-white rounded-lg border-2 border-slate-200">
              ⚡ 99.9% Uptime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-slate-900">{question}</span>
        <svg
          className={`w-5 h-5 text-slate-600 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6 text-slate-600">
          {answer}
        </div>
      )}
    </div>
  )
}
