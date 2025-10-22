import { useState } from 'react'
import type { NegotiationPointT } from '../lib/schemas'

export default function NegotiationTemplates({ points }: { points: NegotiationPointT[] }) {
  const [copied, setCopied] = useState<number | null>(null)

  if (points.length === 0) return null

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      alert('Failed to copy. Please select and copy manually.')
    }
  }

  const importanceConfig = {
    critical: { label: 'Must Negotiate', color: 'bg-red-100 text-red-700', icon: '🚨' },
    important: { label: 'Should Negotiate', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' },
    nice_to_have: { label: 'Worth Asking', color: 'bg-blue-100 text-blue-700', icon: '💡' }
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📧</span>
        <h3 className="text-xl font-bold text-ink-900">Ready-to-Send Negotiation Emails</h3>
      </div>

      <p className="text-sm text-ink-600 mb-6">
        These email templates have a <strong>{Math.round(points.reduce((acc, p) => acc + p.success_rate, 0) / points.length * 100)}% average success rate</strong>. 
        Copy, personalize, and send!
      </p>

      <div className="space-y-6">
        {points.map((point, i) => {
          const config = importanceConfig[point.importance as keyof typeof importanceConfig] || importanceConfig.important

          return (
            <div key={i} className="border-2 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-paper-50 p-4 border-b flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                    <span className="px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold">
                      {Math.round(point.success_rate * 100)}% success rate
                    </span>
                  </div>
                  <h4 className="font-bold text-ink-900">{point.clause_title}</h4>
                  <div className="text-sm text-ink-600 mt-2 space-y-1">
                    <div>Current: <span className="font-medium text-red-700">{point.current_term}</span></div>
                    <div>Suggested: <span className="font-medium text-green-700">{point.suggested_term}</span></div>
                  </div>
                </div>
              </div>

              {/* Email template */}
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink-600">EMAIL TEMPLATE:</span>
                  <button
                    onClick={() => copyToClipboard(point.email_template, i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      copied === i
                        ? 'bg-green-500 text-white'
                        : 'bg-paper-100 hover:bg-brand-blue hover:text-white'
                    }`}
                  >
                    {copied === i ? '✓ Copied!' : '📋 Copy Email'}
                  </button>
                </div>
                
                <pre className="bg-ink-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
{point.email_template}
                </pre>

                <div className="mt-3 flex gap-2">
                  <button className="text-sm px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>What if they say no?</span>
                  </button>
                  
                  <button className="text-sm px-4 py-2 bg-paper-100 text-ink-700 rounded-lg hover:bg-paper-200 transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>See examples</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Negotiation Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be polite but firm - you're a customer, not asking for a favor</li>
          <li>• Reference market standards - they want your business</li>
          <li>• Be ready to walk away - best negotiation leverage</li>
          <li>• Ask for all changes at once - easier to get package deal</li>
        </ul>
      </div>
    </div>
  )
}
