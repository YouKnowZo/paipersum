export default function TrustBadges() {
  return (
    <div className="py-12 bg-paper-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main trust headline */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 rounded-full mb-4">
            <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-brand-green">Trusted by 5,000+ Users</span>
          </div>
          <h2 className="text-3xl font-bold text-ink-900 mb-3">
            Why People Trust PaiperSum
          </h2>
          <p className="text-ink-600 max-w-2xl mx-auto">
            We're not just another tool. We're your personal contract protection team.
          </p>
        </div>

        {/* Trust metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-2xl shadow-soft hover-lift">
            <div className="text-4xl font-bold bg-gradient-to-r from-brand-blue to-brand-blue-bright bg-clip-text text-transparent mb-2">
              $450K+
            </div>
            <div className="text-sm text-ink-600">Protected for Users</div>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-soft hover-lift">
            <div className="text-4xl font-bold bg-gradient-to-r from-brand-green to-green-600 bg-clip-text text-transparent mb-2">
              15,000+
            </div>
            <div className="text-sm text-ink-600">Documents Analyzed</div>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-soft hover-lift">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className="text-sm text-ink-600">User Rating</div>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-soft hover-lift">
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
              3 sec
            </div>
            <div className="text-sm text-ink-600">Average Analysis</div>
          </div>
        </div>

        {/* Security badges */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-border-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-ink-900 mb-1">Your Data is Private</h3>
              <p className="text-sm text-ink-600">
                We never store your documents. Analysis happens in real-time and is immediately discarded.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-border-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-ink-900 mb-1">Bank-Level Security</h3>
              <p className="text-sm text-ink-600">
                256-bit encryption, secure connections, and regular security audits keep you protected.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-border-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-ink-900 mb-1">Community Verified</h3>
              <p className="text-sm text-ink-600">
                Our analysis is validated by 5,000+ real users who've saved real money.
              </p>
            </div>
          </div>
        </div>

        {/* Social proof logos */}
        <div className="mt-12 text-center">
          <p className="text-sm text-ink-500 mb-6">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {/* Placeholder for actual press logos */}
            <div className="px-6 py-3 bg-paper-100 rounded-lg text-ink-600 font-semibold">
              ProductHunt
            </div>
            <div className="px-6 py-3 bg-paper-100 rounded-lg text-ink-600 font-semibold">
              HackerNews
            </div>
            <div className="px-6 py-3 bg-paper-100 rounded-lg text-ink-600 font-semibold">
              Reddit
            </div>
            <div className="px-6 py-3 bg-paper-100 rounded-lg text-ink-600 font-semibold">
              TechCrunch
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-ink-900 mb-3">
              100% Money-Back Guarantee
            </h3>
            <p className="text-ink-600 mb-4">
              If PaiperSum doesn't save you money in your first month, we'll refund you immediately. No questions asked.
            </p>
            <p className="text-sm text-ink-500">
              We're that confident it works.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
