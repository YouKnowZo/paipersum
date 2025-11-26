export default function Features() {
  const features = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Analysis',
      description: 'Upload a document and get results in seconds. Clear, action-oriented summaries powered by advanced AI.',
      highlight: 'Lightning fast',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '14+ Risk Types',
      description: 'Detects hidden fees, auto-renewals, arbitration clauses, liability waivers, and more critical terms.',
      highlight: 'Comprehensive',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Visual Risk Score',
      description: 'See your risk at a glance with color-coded scores, confidence levels, and plain English explanations.',
      highlight: 'Easy to understand',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: '100% Private',
      description: 'Your documents are analyzed in-memory and immediately deleted. Zero storage. Zero tracking. Zero sharing.',
      highlight: 'Bank-level security',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'PDF Export',
      description: 'Download professional reports with full citations, risk breakdowns, and recommendations you can share.',
      highlight: 'Professional output',
      gradient: 'from-purple-400 to-indigo-500'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Built for Everyone',
      description: 'Whether you\'re renting an apartment, joining a gym, or signing a contract—we\'ve got your back.',
      highlight: 'Human-centered',
      gradient: 'from-pink-400 to-rose-500'
    }
  ]

  return (
    <div className="py-20 bg-gradient-to-b from-white via-paper-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 rounded-full mb-6">
            <svg className="w-5 h-5 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-brand-blue">Premium Features</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-6">
            Everything You Need to Stay Safe
          </h2>
          <p className="text-xl text-ink-600 max-w-3xl mx-auto leading-relaxed">
            Stop signing documents blindly. Our AI-powered platform gives you the clarity 
            and confidence to make informed decisions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group relative p-8 bg-white border-2 border-border-200 rounded-2xl hover:border-brand-blue hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                {/* Icon with gradient background */}
                <div className={`inline-flex p-3 bg-gradient-to-br ${feature.gradient} rounded-xl mb-5 text-white group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-ink-900 mb-3">
                  {feature.title}
                </h3>

                {/* Highlight badge */}
                <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full mb-4 border border-brand-blue/20">
                  {feature.highlight}
                </div>

                {/* Description */}
                <p className="text-ink-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-16 border-t border-border-200">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">30 sec</div>
              <div className="text-ink-600">Average Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">99.2%</div>
              <div className="text-ink-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">24/7</div>
              <div className="text-ink-600">Available Anytime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">0</div>
              <div className="text-ink-600">Documents Stored</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
