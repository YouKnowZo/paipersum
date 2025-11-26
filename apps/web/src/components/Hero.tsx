type HeroProps = {
  onAnalyze?: () => void
  onOpenAdmin?: () => void
}

export default function Hero({ onAnalyze, onOpenAdmin }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue to-blue-900">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/30 text-white/70 text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            Live anything analyzer · SOC-grade threat desk
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Make sense of any document, feed, or log in seconds.
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            PaiperSum Atlas combines our flagship contract and policy analyzer with a real-time cybersecurity portal.
            Upload RFPs, NDAs, privacy updates, compliance questionnaires, even SIEM exports—receive a board-ready brief
            and see every blocked attack without leaving one screen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onAnalyze}
              className="px-8 py-4 bg-white text-brand-blue rounded-xl font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start analyzing →
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition"
            >
              Open security portal
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-2 7a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
              </svg>
              <span>Plain-English executive briefs</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3h14a1 1 0 011 1v8a1 1 0 01-1 1H7l-4 4V4a1 1 0 010-1z" clipRule="evenodd" />
              </svg>
              <span>Detections streamed live</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Zero stored data by default</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4h12l-1.5 9h-9L4 4zm2 13h8" />
              </svg>
              <span>Not legal or security advice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
