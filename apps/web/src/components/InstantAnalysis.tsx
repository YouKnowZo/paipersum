import { useState } from 'react'
import { analyzeText } from '../lib/api'
import type { AnalysisT } from '../lib/schemas'

// Quick analysis examples users can try instantly
const QUICK_EXAMPLES = [
  {
    title: 'Gym Membership',
    emoji: '💪',
    preview: 'See hidden fees and cancellation tricks',
    text: 'You agree to a 12-month commitment. Cancellation requires 30 days written notice and a $50 fee. The membership automatically renews. We reserve the right to change pricing with 30 days notice.'
  },
  {
    title: 'Phone Contract',
    emoji: '📱',
    preview: 'Find early termination fees',
    text: 'This 24-month service agreement includes an early termination fee of $350. You waive your right to participate in class action lawsuits. All disputes must be resolved through binding arbitration.'
  },
  {
    title: 'Apartment Lease',
    emoji: '🏠',
    preview: 'Spot unfair clauses',
    text: 'Tenant agrees to indemnify and hold harmless the Landlord from all claims. Landlord may enter premises with 24 hours notice. Security deposit is non-refundable for cleaning fees.'
  },
  {
    title: 'Software ToS',
    emoji: '💻',
    preview: 'See what data they collect',
    text: 'We collect and share your data with third parties for advertising. You grant us a perpetual license to your content. We disclaim all warranties and limit liability to $100.'
  }
]

export default function InstantAnalysis() {
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [result, setResult] = useState<{example: string, analysis: AnalysisT} | null>(null)

  const handleQuickAnalysis = async (example: typeof QUICK_EXAMPLES[0]) => {
    setAnalyzing(example.title)
    setResult(null)

    try {
      const analysis = await analyzeText(example.text)
      setResult({ example: example.title, analysis })
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <div className="bg-gradient-to-b from-paper-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">
            Try it Right Now
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Click any example below for instant analysis. No signup, no waiting.
          </p>
        </div>

        {/* Quick examples grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {QUICK_EXAMPLES.map((example) => (
            <button
              key={example.title}
              onClick={() => handleQuickAnalysis(example)}
              disabled={analyzing === example.title}
              className="group relative p-6 bg-white border-2 border-border-200 rounded-xl hover:border-brand-navy hover:shadow-lg transition-all text-left disabled:opacity-50"
            >
              <div className="text-4xl mb-3">{example.emoji}</div>
              <div className="font-bold text-ink-900 mb-2">{example.title}</div>
              <div className="text-sm text-ink-600 mb-4">{example.preview}</div>
              
              {analyzing === example.title ? (
                <div className="flex items-center gap-2 text-sm text-brand-navy font-medium">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-brand-navy font-medium group-hover:gap-3 transition-all">
                  <span>Analyze Now</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quick result */}
        {result && (
          <div className="bg-white border-2 border-brand-navy rounded-xl p-6 shadow-xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ink-900">
                {result.example} Analysis
              </h3>
              <button
                onClick={() => setResult(null)}
                className="text-ink-500 hover:text-ink-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Risk score */}
              <div>
                <div className="text-sm text-ink-600 mb-2">Risk Score</div>
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-5xl font-bold text-brand-red">{result.analysis.risk_score}</div>
                  <div className="text-lg text-ink-600 mb-2">
                    {result.analysis.risk_score >= 75 ? 'High Risk' : 
                     result.analysis.risk_score >= 50 ? 'Moderate' : 'Low Risk'}
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      result.analysis.risk_score >= 75 ? 'bg-brand-red' :
                      result.analysis.risk_score >= 50 ? 'bg-brand-yellow' : 'bg-brand-green'
                    }`}
                    style={{ width: `${result.analysis.risk_score}%` }}
                  />
                </div>
              </div>

              {/* Found clauses */}
              <div>
                <div className="text-sm text-ink-600 mb-2">Found {result.analysis.clauses.length} Issues</div>
                <div className="space-y-2">
                  {result.analysis.clauses.slice(0, 3).map((clause, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${
                        clause.risk === 'red' ? 'bg-brand-red' :
                        clause.risk === 'yellow' ? 'bg-brand-yellow' : 'bg-brand-green'
                      }`} />
                      <span className="text-ink-700">{clause.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-ink-600 mb-4">
                Want full analysis with citations and PDF export?
              </p>
              <button className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy/90 transition">
                Analyze Your Own Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
