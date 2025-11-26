export default function Features() {
  const features = [
    {
      icon: '🧭',
      title: 'Atlas briefings',
      description: 'Upload anything—contracts, SOC reports, audits, marketing plans—and get a one-page brief with actions and blockers.',
      highlight: 'Any format'
    },
    {
      icon: '🛡️',
      title: 'Threat desk',
      description: 'Stream blocked attacks, CVE watchlists, and geo heat maps into the same workspace your exec team already uses.',
      highlight: 'Live telemetry'
    },
    {
      icon: '🤝',
      title: 'Negotiation + response kits',
      description: 'Pre-baked legal redlines, procurement replies, customer comms, and trust updates tailored to each analysis.',
      highlight: 'Cross-team ready'
    },
    {
      icon: '🔐',
      title: 'Security defaults on',
      description: 'No training data retention, signed URLs, strict rate limits, and immutable audit logs for every analysis request.',
      highlight: 'Private by design'
    },
    {
      icon: '📦',
      title: 'Free integrations',
      description: 'Drop-in connectors for Slack, Teams, Notion, Jira, Linear, and email digests. No paid add-ons required.',
      highlight: 'Works everywhere'
    },
    {
      icon: '📄',
      title: 'Executive-grade exports',
      description: 'Export PDF, DOCX, or secure links with citations, risk math, and mitigation steps your counsel can trust.',
      highlight: 'Board ready'
    }
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
            Built for legal, security, GTM, and ops in one panel
          </h2>
          <p className="text-lg text-ink-600 max-w-3xl mx-auto">
            No more switching tools. Atlas keeps contracts, privacy updates, product launches, and security telemetry in sync.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group relative p-6 bg-gradient-to-br from-white to-paper-50 border border-border-200 rounded-xl hover:border-brand-blue hover:shadow-lg transition-all"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-ink-900 mb-2">
                {feature.title}
              </h3>

              {/* Highlight */}
              <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-full mb-3">
                {feature.highlight}
              </div>

              {/* Description */}
              <p className="text-ink-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
