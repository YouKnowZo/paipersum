export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blueDeep">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-yellow/60 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-green/60 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Understand Legal Documents<br />
            <span className="text-brand-yellow">in Plain English</span>
          </h1>
          
          <p className="text-xl text-brand-yellow/80 mb-8 max-w-2xl mx-auto">
            AI-powered analysis instantly identifies risks and explains complex legal jargon 
            in contracts, Terms of Service, and agreements.
          </p>

          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-brand-blue rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
              Analyze a Document
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition">
              See an Example
            </button>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-sm text-brand-yellow/70">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-2 7a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
              </svg>
              <span>Human‑friendly summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3h14a1 1 0 011 1v8a1 1 0 01-1 1H7l-4 4V4a1 1 0 010-1z" clipRule="evenodd" />
              </svg>
              <span>Fast, clear results</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Not legal advice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
