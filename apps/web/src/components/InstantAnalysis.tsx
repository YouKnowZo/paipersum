import { useState } from 'react'
import { analyzeText } from '../lib/api'
import type { AnalysisT } from '../lib/schemas'

// Quick analysis examples users can try instantly
const QUICK_EXAMPLES = [
  {
    title: 'Vendor Security Questionnaire',
    emoji: '🛡️',
    preview: 'Condense 180 questions into a summary',
    text: 'Does your organization maintain ISO 27001 certification? Provide evidence of SOC 2 controls, incident response plans, and quarterly access reviews. List every sub-processor with current pen tests.'
  },
  {
    title: 'Sales MSA',
    emoji: '📑',
    preview: 'Surface risk and negotiation levers',
    text: 'Supplier caps liability at fees paid in the last 12 months. Customer must provide 60 days notice to terminate. Data residency limited to US regions. Auto-renewal triggers unless canceled 45 days prior.'
  },
  {
    title: 'Privacy Update Email',
    emoji: '🔍',
    preview: 'See what actually changed',
    text: 'We now share hashed identifiers with strategic partners to measure campaign performance. By continuing to use the service you accept the new arbitration clause and waive class action rights.'
  },
  {
    title: 'SIEM Export',
    emoji: '📈',
    preview: 'Spot spikes in login abuse',
    text: '11,248 failed logins from AS4134 between 03:10-03:18 UTC. Payloads attempted: credential stuffing with known test accounts plus Graph API token probing. WAF rule PS-992 blocked 100% of requests.'
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
            Try the anything analyzer right now
          </h2>
          <p className="text-lg text-ink-600 max-w-3xl mx-auto">
            Legal, security, GTM, ops—Atlas handles it. Tap an example to see how the same engine writes a brief across teams.
          </p>
        </div>

        {/* Quick examples grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {QUICK_EXAMPLES.map((example) => (
            <button
              key={example.title}
              onClick={() => handleQuickAnalysis(example)}
              disabled={analyzing === example.title}
              className="group relative p-6 bg-white border-2 border-border-200 rounded-xl hover:border-brand-blue hover:shadow-lg transition-all text-left disabled:opacity-50"
            >
              <div className="text-4xl mb-3">{example.emoji}</div>
              <div className="font-bold text-ink-900 mb-2">{example.title}</div>
              <div className="text-sm text-ink-600 mb-4">{example.preview}</div>
              
              {analyzing === example.title ? (
                <div className="flex items-center gap-2 text-sm text-brand-blue font-medium">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-brand-blue font-medium group-hover:gap-3 transition-all">
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
          <div className="bg-white border-2 border-brand-blue rounded-xl p-6 shadow-xl animate-in slide-in-from-bottom-4">
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
              <button className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue/90 transition">
                Analyze Your Own Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
