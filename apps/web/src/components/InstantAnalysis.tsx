import { useState } from 'react'
import { analyzeText } from '../lib/api'
import type { EnhancedAnalysisT, ClauseT } from '../lib/schemas'

const QUICK_EXAMPLES = [
  {
    title: 'Gym Membership',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    preview: 'Discover hidden fees & cancellation traps',
    text: 'You agree to a 12-month commitment. Cancellation requires 30 days written notice and a $50 fee. The membership automatically renews at the then-current rate. We reserve the right to change pricing with 30 days notice. Early termination fee of $200 applies.'
  },
  {
    title: 'Phone Contract',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    preview: 'Find early termination fees & hidden clauses',
    text: 'This 24-month service agreement includes an early termination fee of $350. You waive your right to participate in class action lawsuits. All disputes must be resolved through binding arbitration. Service may be suspended without notice for suspected policy violations.'
  },
  {
    title: 'Apartment Lease',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    preview: 'Spot unfair clauses & liability shifts',
    text: 'Tenant agrees to indemnify and hold harmless the Landlord from all claims, damages, and expenses. Landlord may enter premises with 24 hours notice or without notice in emergencies. Security deposit is non-refundable for cleaning fees up to $500.'
  },
  {
    title: 'Software Terms',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    preview: 'Understand data & privacy implications',
    text: 'We collect and may share your data with third parties for advertising and analytics purposes. You grant us a perpetual, worldwide license to your content. We disclaim all warranties and limit our total liability to $100 regardless of damages.'
  }
]

export default function InstantAnalysis() {
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [result, setResult] = useState<{example: string, analysis: EnhancedAnalysisT} | null>(null)

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

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'danger'
    if (score >= 50) return 'warning'
    return 'success'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'High Risk'
    if (score >= 50) return 'Medium Risk'
    return 'Low Risk'
  }

  return (
    <section className="section bg-white" id="examples">
      <div className="container-wide">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-info mb-4">Live Demo</span>
          <h2 className="mb-6">
            Try it now,
            <br />
            <span className="gradient-text">no signup required</span>
          </h2>
          <p className="text-xl text-slate-600">
            Click any example below to see instant AI analysis. Experience the power of 
            understanding legal documents in seconds.
          </p>
        </div>

        {/* Examples grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {QUICK_EXAMPLES.map((example) => (
            <button
              key={example.title}
              onClick={() => handleQuickAnalysis(example)}
              disabled={analyzing === example.title}
              className="group text-left p-6 bg-white rounded-2xl border border-slate-200 
                        hover:border-brand-sky hover:shadow-lg transition-all duration-300
                        disabled:opacity-70 disabled:cursor-wait"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center 
                            text-slate-600 group-hover:bg-brand-navy group-hover:text-white 
                            transition-all duration-300 mb-4">
                {example.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-slate-900 mb-2">{example.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{example.preview}</p>
              
              {/* CTA */}
              {analyzing === example.title ? (
                <div className="flex items-center gap-2 text-sm text-brand-sky font-medium">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-brand-blue font-medium 
                              group-hover:gap-3 transition-all duration-300">
                  <span>Analyze Now</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Analysis result */}
        {result && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Result header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {result.example} Analysis
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">AI-powered risk assessment</p>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Result content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Risk score */}
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-3">Overall Risk Score</div>
                    <div className="flex items-end gap-4 mb-4">
                      <div className={`text-6xl font-display font-bold text-${getRiskColor(result.analysis.risk_score)}-600`}>
                        {result.analysis.risk_score}
                      </div>
                      <div className={`badge badge-${getRiskColor(result.analysis.risk_score)} mb-2`}>
                        {getRiskLabel(result.analysis.risk_score)}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-${getRiskColor(result.analysis.risk_score)}-500 animate-fill-right`}
                        style={{ width: `${result.analysis.risk_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Found clauses */}
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-3">
                      {result.analysis.clauses.length} Issues Detected
                    </div>
                    <div className="space-y-3">
                      {result.analysis.clauses.slice(0, 4).map((clause: ClauseT, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            clause.risk === 'red' ? 'bg-danger-500' :
                            clause.risk === 'yellow' ? 'bg-warning-500' : 'bg-success-500'
                          }`} />
                          <span className="text-slate-700">{clause.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-slate-600 mb-4">
                    Want a full analysis with citations, negotiation templates, and PDF export?
                  </p>
                  <button className="btn-primary">
                    Analyze Your Own Document
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
