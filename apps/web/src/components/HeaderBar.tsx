export default function HeaderBar() {
  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-lg text-ink-900">PaiperSum</span>
          <span className="hidden sm:inline text-sm text-ink-500 ml-3">Legal Document Simplifier</span>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center gap-2 text-xs text-brand-amber bg-brand-yellow/15 px-3 py-1.5 rounded-full border border-brand-yellow/40">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Not legal advice
        </span>
        
        <button 
          className="w-9 h-9 rounded-full bg-paper-100 border border-border-200 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex items-center justify-center"
          aria-label="User menu"
        >
          <svg className="w-5 h-5 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
