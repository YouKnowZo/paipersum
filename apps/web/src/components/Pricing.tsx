const plans = [
  {
    name: 'Starter',
    price: '$0',
    tagline: 'For solo operators validating copy & clauses.',
    highlights: [
      '40 analyses / month',
      'Weekly security digest',
      'PDF + DOCX export',
      'Email support'
    ],
    cta: 'Stay free'
  },
  {
    name: 'Operator',
    price: '$49',
    tagline: 'Unlimited anything analysis + live threat desk.',
    highlights: [
      'Unlimited analyses & uploads',
      'Real-time attack portal',
      'Slack/Teams/Notion sync',
      'Dedicated success manager'
    ],
    cta: 'Upgrade to Operator',
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    tagline: 'SOC 2, SSO, private deployments, white-glove onboarding.',
    highlights: [
      'Private AI enclaves',
      'SSO + SCIM + audit APIs',
      'On-call trust engineer',
      'DPA + custom clauses'
    ],
    cta: 'Talk to sales'
  }
]

export default function Pricing() {
  return (
    <div className="bg-paper-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-brand-blue uppercase tracking-wide mb-2">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
            Straightforward plans. No add-on traps.
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Every plan includes full analyzer capabilities, security portal access, and compliance disclaimers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-6 bg-white shadow-sm flex flex-col ${
                plan.featured ? 'border-brand-blue shadow-xl scale-[1.01]' : 'border-border-200'
              }`}
            >
              <div className="mb-4">
                <p className="text-sm font-semibold text-brand-blue uppercase tracking-wide">{plan.name}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-ink-900">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-sm text-ink-500">per seat / month</span>
                  )}
                </div>
                <p className="text-sm text-ink-600 mt-2">{plan.tagline}</p>
              </div>

              <ul className="space-y-3 text-sm text-ink-700 flex-1">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
                  plan.featured
                    ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                    : 'border border-border-200 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-500 text-center mt-8">
          Prices listed in USD. No legal or security guarantees are provided—PaiperSum Atlas is an informational tool only.
        </p>
      </div>
    </div>
  )
}
