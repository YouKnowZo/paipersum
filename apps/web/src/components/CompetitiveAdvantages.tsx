import { useState } from 'react'

export default function CompetitiveAdvantages() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const advantages = [
    {
      title: "Document-Specific AI Chat",
      description: "Ask questions about YOUR document. ChatGPT gives generic answers. PaiperSum understands YOUR specific contract.",
      icon: "💬",
      comparison: {
        them: "Generic answers, no document context",
        us: "Answers based on YOUR specific document"
      }
    },
    {
      title: "Visual Risk Highlighting",
      description: "See risks highlighted directly in your original document. Click to learn more.",
      icon: "👁️",
      comparison: {
        them: "Plain text output",
        us: "Visual highlighting in original document"
      }
    },
    {
      title: "Actionable Recommendations",
      description: "Don't just get a summary. Get Sign/Negotiate/Walk Away recommendations with reasons.",
      icon: "✅",
      comparison: {
        them: "Just text summaries",
        us: "Actionable recommendations with confidence scores"
      }
    },
    {
      title: "Cost Impact Calculator",
      description: "See real dollar amounts you could lose. Hidden fees, auto-renewals, cancellation costs.",
      icon: "💰",
      comparison: {
        them: "No cost analysis",
        us: "Real dollar impact calculations"
      }
    },
    {
      title: "Negotiation Templates",
      description: "Ready-to-send emails to negotiate better terms. No need to write from scratch.",
      icon: "📧",
      comparison: {
        them: "No negotiation support",
        us: "Pre-written negotiation emails"
      }
    },
    {
      title: "Browser Extension",
      description: "Automatically detects TOS/Privacy policies on websites. One-click analysis.",
      icon: "🔌",
      comparison: {
        them: "Manual copy-paste",
        us: "Automatic detection and analysis"
      }
    },
    {
      title: "Document Comparison",
      description: "Compare two versions side-by-side. See exactly what changed.",
      icon: "🔄",
      comparison: {
        them: "No version comparison",
        us: "Side-by-side document comparison"
      }
    },
    {
      title: "Smart Notifications",
      description: "Get calendar reminders for renewal dates, cancellation deadlines, payment dates.",
      icon: "📅",
      comparison: {
        them: "No reminders",
        us: "Automatic calendar integration"
      }
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why PaiperSum vs ChatGPT/DeepSeek/Google AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            They're great for general chat. We're built specifically for documents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {advantages.map((advantage, i) => (
            <div
              key={i}
              className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition cursor-pointer ${
                selectedFeature === i ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
              onClick={() => setSelectedFeature(selectedFeature === i ? null : i)}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{advantage.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
                  <p className="text-gray-600 mb-4">{advantage.description}</p>
                  
                  {selectedFeature === i && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                        <div className="text-xs font-semibold text-red-700 mb-1">THEM:</div>
                        <div className="text-sm text-red-800">{advantage.comparison.them}</div>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                        <div className="text-xs font-semibold text-green-700 mb-1">US:</div>
                        <div className="text-sm text-green-800">{advantage.comparison.us}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Try It?</h3>
            <p className="text-blue-100 mb-6">
              Upload a document and see the difference. No signup required.
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition">
              Analyze Your Document →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
