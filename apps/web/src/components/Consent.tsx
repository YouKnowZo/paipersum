import { useEffect, useState } from 'react'

export default function Consent() {
  const [accepted, setAccepted] = useState(localStorage.getItem('PS_CONSENT') === '1')

  useEffect(() => {
    if (!accepted) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [accepted])

  if (accepted) return null

  const handleAccept = () => {
    localStorage.setItem('PS_CONSENT', '1')
    setAccepted(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-paper-0 rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h3 className="font-semibold text-xl mb-3">Important Legal Notice</h3>
        <div className="space-y-3 text-sm text-ink-600">
          <p>
            <strong>NOT LEGAL ADVICE:</strong> PaiperSum provides automated summaries and risk assessments 
            of legal documents using AI and pattern matching. This service is for informational purposes only 
            and does not constitute legal advice.
          </p>
          <p>
            <strong>No Attorney-Client Relationship:</strong> Use of this service does not create an 
            attorney-client relationship. For legal decisions, consult a licensed attorney in your jurisdiction.
          </p>
          <p>
            <strong>Accuracy Disclaimer:</strong> While we strive for accuracy, automated analysis may 
            miss important clauses or misinterpret legal language. Always review original documents carefully.
          </p>
          <p>
            By continuing, you acknowledge that you have read and understood these limitations and agree 
            to our <a href="/terms" className="text-brand-blue hover:underline">Terms of Service</a> and{' '}
            <a href="/privacy" className="text-brand-blue hover:underline">Privacy Policy</a>.
          </p>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <a 
            href="/terms" 
            target="_blank"
            className="text-sm px-4 py-2 text-ink-600 hover:text-ink-900 underline"
          >
            Read Terms
          </a>
          <a 
            href="/privacy" 
            target="_blank"
            className="text-sm px-4 py-2 text-ink-600 hover:text-ink-900 underline"
          >
            Read Privacy Policy
          </a>
          <button 
            onClick={handleAccept}
            className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors font-medium"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  )
}
