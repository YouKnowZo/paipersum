import { useState } from 'react'

export default function OnePersonAIStory() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Built by One Person + AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This is the future: Human creativity amplified by artificial intelligence. 
            No billion-dollar teams. No massive funding rounds. Just vision, determination, and the right tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Vision</h3>
            <p className="text-gray-600">
              Imagine a world where everyone understands every document they sign. 
              No hidden fees, no surprise clauses, no exploitation.
            </p>
          </div>

          {/* AI Amplification */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Amplification</h3>
            <p className="text-gray-600">
              AI handles the heavy lifting: reading, analyzing, extracting. 
              Human adds the context, empathy, and understanding that makes it useful.
            </p>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-100">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Proven Results</h3>
            <p className="text-gray-600">
              Built in weeks, not years. Deployed globally. Used by thousands. 
              All without a traditional team structure.
            </p>
          </div>
        </div>

        {/* The Story */}
        <div className="bg-white rounded-2xl p-10 shadow-xl border-2 border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">The Story</h3>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                <strong>PaiperSum wasn't built by a team of 50 engineers.</strong> It wasn't backed by $10 million in venture capital. 
                It was built by one person with a vision and the right AI tools.
              </p>
              <p>
                This is what the future of software looks like: <strong>Human creativity + AI capability = Unlimited potential.</strong>
              </p>
              <p>
                While others debate whether AI will replace developers, we're showing what happens when you <strong>partner</strong> with AI. 
                You don't need to be replaced. You need to be amplified.
              </p>
              <p className="text-center pt-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  This is the new way. This is PaiperSum.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
            <div className="text-gray-600">Person</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-gray-600">Possibilities</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">100%</div>
            <div className="text-gray-600">Open Source</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
