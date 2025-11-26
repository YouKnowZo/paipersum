import { useState } from 'react'

const CANNED_RESPONSES: Record<string, string> = {
  'indemnification': 'Indemnification means YOU have to pay if something goes wrong—even if it\'s not your fault. It\'s one of the riskiest clauses in contracts. Look for limits or mutual indemnification.',
  'arbitration': 'Arbitration clauses force you to resolve disputes privately instead of court. You usually can\'t appeal and the process often favors the company. These can significantly limit your legal options.',
  'auto-renewal': 'Auto-renewal means your subscription automatically continues (and charges you) unless you actively cancel. Always check the cancellation notice period—sometimes it\'s 30-60 days!',
  'class action': 'Class action waivers mean you can\'t join group lawsuits. You have to sue individually, which is expensive and impractical for most people. This protects companies from major accountability.',
  'liability': 'Liability limitations cap how much the company has to pay if they screw up. Sometimes it\'s absurdly low like $100, even if you lose thousands. Always check the cap amount.',
  'warranty': 'No warranty means the product is sold "as is"—if it breaks or doesn\'t work, that\'s your problem. Look for what IS covered and for how long.',
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I explain legal terms in plain English. Ask me about "indemnification", "arbitration", or any legal term you\'re unsure about.' }
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

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')

    const lowercaseText = text.toLowerCase()
    let response = 'I can explain: indemnification, arbitration, auto-renewal, class action waivers, liability limits, and warranties. What would you like to know about?'

    for (const [keyword, answer] of Object.entries(CANNED_RESPONSES)) {
      if (lowercaseText.includes(keyword)) {
        response = answer
        break
      }
    }

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
          className="fixed bottom-6 right-6 w-14 h-14 bg-brand-navy text-white rounded-full 
                     shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 
                     flex items-center justify-center group"
          aria-label="Open legal assistant chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-teal rounded-full 
                          border-2 border-white flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">?</span>
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] 
                       bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up
                       border border-slate-200">
          {/* Header */}
          <div className="bg-brand-navy text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Legal Terms Helper</div>
                <div className="text-xs text-slate-300">Plain English explanations</div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-lg transition"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-navy text-white rounded-br-md' 
                    : 'bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 bg-slate-50">
              <div className="text-xs text-slate-500 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 
                              hover:bg-brand-navy hover:text-white hover:border-brand-navy 
                              rounded-full transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any legal term..."
                className="input flex-1"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="btn-primary px-4 disabled:opacity-50"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Educational explanations only—not legal advice
            </p>
          </div>
        </div>
      )}
    </>
  )
}
