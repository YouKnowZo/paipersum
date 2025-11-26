export default function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Instant Analysis',
      description: 'Upload a document and get results quickly. Clear, action‑oriented summaries.',
      highlight: 'Fast turnaround'
    },
    {
      icon: '🎯',
      title: '14 Risk Types',
      description: 'Detects hidden fees, auto-renewals, arbitration clauses, and more.',
      highlight: 'Comprehensive'
    },
    {
      icon: '📊',
      title: 'Visual Risk Score',
      description: 'See your risk at a glance with color-coded scores and plain English.',
      highlight: 'Easy to understand'
    },
    {
      icon: '🔒',
      title: '100% Private',
      description: 'Your documents are analyzed and immediately deleted. Zero storage.',
      highlight: 'Your data, your privacy'
    },
    {
      icon: '📄',
      title: 'PDF Export',
      description: 'Download professional reports with citations you can share.',
      highlight: 'Professional output'
    },
    {
      icon: '👤',
      title: 'Designed for People',
      description: 'Friendly experience that respects your time and privacy.',
      highlight: 'Human‑centered'
    }
  ]

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
            Everything You Need to Stay Safe
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Stop signing documents blindly. Know exactly what you're agreeing to.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group relative p-6 bg-gradient-to-br from-white to-paper-50 border border-border-200 rounded-xl hover:border-brand-navy hover:shadow-lg transition-all"
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
              <div className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-navy text-xs font-semibold rounded-full mb-3">
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
