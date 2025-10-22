import { useState } from 'react'

export default function Hero({ onAnalyze }: { onAnalyze: (text: string) => void }) {
  const [showDemo, setShowDemo] = useState(false)

  const demoText = `I agree to indemnify and hold harmless the Company from any claims. This agreement automatically renews annually unless canceled 30 days prior. All disputes must be resolved through binding arbitration. You waive your right to participate in class action lawsuits.`

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white mb-6 hover:bg-white/20 transition cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-medium">Try it free - No signup required</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Stop Getting Screwed by<br />
            <span className="bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
              Fine Print
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload any contract, Terms of Service, or legal document. 
            Get instant AI analysis that shows exactly what you're agreeing to - 
            <span className="text-yellow-300 font-semibold"> in plain English</span>.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowDemo(true)}
              className="group px-8 py-4 bg-white text-brand-blue rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Analyze Document Free</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button
              onClick={() => onAnalyze(demoText)}
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm"
            >
              See Example Analysis
            </button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Results in 3 Seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">100% Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">5,000+</div>
              <div className="text-sm text-blue-200">Documents Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">14</div>
              <div className="text-sm text-blue-200">Risk Types Detected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">3 sec</div>
              <div className="text-sm text-blue-200">Average Analysis Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-blue-200">Free & Private</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
