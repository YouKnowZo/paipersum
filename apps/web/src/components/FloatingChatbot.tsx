import { useState } from 'react'

const CANNED_RESPONSES: Record<string, string> = {
  'indemnification': 'Indemnification means YOU have to pay if something goes wrong - even if it\'s not your fault. It\'s one of the riskiest clauses.',
  'arbitration': 'Arbitration clauses force you to resolve disputes privately instead of court. You usually can\'t appeal and it often favors the company.',
  'auto-renewal': 'Auto-renewal means your subscription automatically continues (and charges you) unless you actively cancel. Check the cancellation terms!',
  'class action': 'Class action waivers mean you can\'t join group lawsuits. You have to sue individually, which is expensive and impractical for most people.',
  'liability': 'Liability limitations cap how much the company has to pay if they screw up. Sometimes it\'s absurdly low like $100.',
  'warranty': 'No warranty means the product is sold "as is" - if it breaks or doesn\'t work, that\'s your problem, not theirs.',
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m here to explain legal jargon. Try asking about "indemnification" or "arbitration"!' }
  ])
  const [input, setInput] = useState('')

  const quickQuestions = [
    'What is indemnification?',
    'Explain arbitration',
    'What\'s auto-renewal?',
    'Class action waiver?'
  ]

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')

    // Simple keyword matching for demo
    const lowercaseText = text.toLowerCase()
    let response = 'I can explain: indemnification, arbitration, auto-renewal, class action waivers, liability limits, and warranties. What would you like to know about?'

    for (const [keyword, answer] of Object.entries(CANNED_RESPONSES)) {
      if (lowercaseText.includes(keyword)) {
        response = answer
        break
      }
    }

    // Add bot response with delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: response }])
    }, 500)
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-yellow text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-brand-green rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue to-brand-yellow text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
                <span className="text-2xl">🤖</span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-green rounded-full border-2 border-white"></span>
              </div>
              <div>
                <div className="font-bold">Legal Assistant</div>
                <div className="text-xs text-brand-yellow/80">Always online</div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="hover:bg-white/10 p-2 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-paper-50 to-white">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-brand-blue text-white rounded-br-sm' 
                    : 'bg-white text-ink-700 rounded-bl-sm shadow-sm border border-border-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-ink-500 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1.5 bg-paper-100 hover:bg-brand-blue hover:text-white rounded-full transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any legal term..."
                className="flex-1 px-4 py-3 border border-border-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-4 py-3 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-ink-500 mt-2 text-center">
              💡 I explain legal terms in plain English (not legal advice)
            </p>
          </div>
        </div>
      )}
    </>
  )
}
