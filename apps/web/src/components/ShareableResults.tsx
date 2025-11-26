import { useState } from 'react'
import type { EnhancedAnalysisT } from '../lib/schemas'
import { Card } from './Cards'

export default function ShareableResults({ analysis }: { analysis: EnhancedAnalysisT }) {
  const [copied, setCopied] = useState(false)

  const shareText = `I just analyzed my contract with PaiperSum

Risk Score: ${analysis.risk_score}/100
Found: ${analysis.clauses.length} clauses to review
Recommendation: ${analysis.recommendation.decision === 'walk_away' ? 'WALK AWAY' : analysis.recommendation.decision === 'negotiate' ? 'NEGOTIATE' : 'SAFE TO SIGN'}
Potential savings: $${analysis.recommendation.cost_impact}

Everyone should check their contracts before signing!

Try it free: paipersum.com`

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Failed to copy')
    }
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://paipersum.com')}`
    window.open(url, '_blank')
  }

  return (
    <Card title="Share Your Findings">
      <p className="text-sm text-slate-600 mb-6">
        Help your friends and family avoid bad contracts by sharing your analysis.
      </p>

      {/* Share preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
          {shareText}
        </pre>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={shareToTwitter}
          className="btn bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] py-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
          Twitter
        </button>

        <button
          onClick={shareToLinkedIn}
          className="btn bg-[#0077B5] text-white hover:bg-[#006399] py-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </button>

        <button
          onClick={copyShareText}
          className={`btn py-3 ${copied ? 'btn-accent' : 'btn-secondary'}`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-brand-teal/5 border border-brand-teal/20 rounded-xl">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Why share?</span> The more people review contracts before signing, 
          the more pressure companies face to improve their terms.
        </p>
      </div>
    </Card>
  )
}
