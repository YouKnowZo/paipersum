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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-semibold text-xl text-slate-900">Important Notice</h3>
            <p className="text-sm text-slate-500">Please read before continuing</p>
          </div>
        </div>
        
        <div className="space-y-4 text-sm text-slate-600 mb-8">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-900 mb-1">Not Legal Advice</h4>
            <p>PaiperSum provides AI-powered summaries and risk assessments for informational purposes only. This is not legal advice.</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-900 mb-1">No Attorney-Client Relationship</h4>
            <p>Use of this service does not create an attorney-client relationship. For legal decisions, consult a licensed attorney.</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-900 mb-1">Accuracy Disclaimer</h4>
            <p>Automated analysis may miss important clauses or misinterpret legal language. Always review original documents carefully.</p>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 mb-6">
          By continuing, you acknowledge these limitations and agree to our{' '}
          <a href="/terms.html" target="_blank" className="text-brand-blue hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy.html" target="_blank" className="text-brand-blue hover:underline">Privacy Policy</a>.
        </p>
        
        <div className="flex gap-3">
          <a 
            href="/terms.html" 
            target="_blank"
            className="btn-ghost text-sm"
          >
            Read Terms
          </a>
          <button 
            onClick={handleAccept}
            className="btn-primary flex-1"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  )
}
