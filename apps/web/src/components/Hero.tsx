export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left lg:pr-8">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-white">Trusted by 50,000+ users</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Stop Getting Screwed<br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                By Fine Print
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-xl leading-relaxed">
              AI-powered legal analysis that translates complex contracts into plain English. 
              Know what you're signing—before it's too late.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="group px-8 py-4 bg-white text-brand-blue rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center justify-center gap-2">
                <span>Analyze Document Free</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="px-8 py-4 bg-transparent backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white mb-1">100K+</div>
                <div className="text-sm text-blue-200">Documents Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">$2.5M</div>
                <div className="text-sm text-blue-200">Saved by Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                <div className="text-sm text-blue-200">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual representation with professional imagery */}
          <div className="relative lg:h-[600px] hidden lg:block">
            {/* Professional mockup cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Main card - Document preview */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-ink-900">Contract Analyzed</div>
                    <div className="text-sm text-ink-600">Risk Assessment Complete</div>
                  </div>
                </div>
                
                {/* Risk indicator */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-800">Risk Score</span>
                    <span className="text-2xl font-bold text-green-600">32/100</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '32%'}}></div>
                  </div>
                </div>

                {/* Key findings */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-ink-700">No hidden cancellation fees</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-ink-700">Auto-renewal after 12 months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-ink-700">Standard arbitration clause</span>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                  View Full Analysis
                </button>
              </div>

              {/* Floating testimonial cards */}
              <div className="absolute -right-8 top-12 bg-white rounded-xl shadow-xl p-4 max-w-xs animate-float">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                  <div>
                    <div className="font-semibold text-sm text-ink-900">Sarah Johnson</div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-ink-600">"Saved me $500 on my lease!"</p>
              </div>

              <div className="absolute -left-8 bottom-24 bg-white rounded-xl shadow-xl p-4 max-w-xs animate-float" style={{animationDelay: '2s'}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                  <div>
                    <div className="font-semibold text-sm text-ink-900">Michael Chen</div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-ink-600">"Found hidden fees instantly"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-white font-semibold mb-1">Instant Analysis</div>
            <div className="text-sm text-blue-200">Results in seconds</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-white font-semibold mb-1">100% Private</div>
            <div className="text-sm text-blue-200">Your data stays yours</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-white font-semibold mb-1">All Formats</div>
            <div className="text-sm text-blue-200">PDF, Word, text</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-white font-semibold mb-1">Save Money</div>
            <div className="text-sm text-blue-200">Avoid hidden fees</div>
          </div>
        </div>
      </div>
    </div>
  )
}
