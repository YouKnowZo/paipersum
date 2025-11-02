import { useState, useEffect, useRef } from 'react'
import { summarizeFile, getSummaryStyles, type SummarizeResponse } from '../lib/api'
import axios from 'axios'

interface DocumentChatProps {
  documentText?: string
  onClose?: () => void
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function DocumentChat({ documentText, onClose }: DocumentChatProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; sources?: string[] }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (documentText) {
      setMessages([{
        role: 'assistant',
        content: `I've analyzed your document. Ask me anything about it! For example:\n• "What are the main risks?"\n• "Explain the cancellation terms"\n• "What should I watch out for?"`
      }])
    }
  }, [documentText])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        question: userMessage,
        document_context: documentText
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources || []
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble processing your question. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    "What are the main risks?",
    "Explain the cancellation terms",
    "What should I watch out for?",
    "Are there any hidden fees?",
    "What are my rights?"
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Ask About Your Document</h2>
            <p className="text-sm text-blue-100">Get instant answers about your uploaded document</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-md border border-gray-200'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Sources:</p>
                    {msg.sources.map((source, idx) => (
                      <p key={idx} className="text-xs text-gray-600 italic mb-1">
                        "{source.substring(0, 100)}..."
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-md border border-gray-200">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="text-xs text-gray-500 mb-2">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-300 rounded-full transition text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask anything about your document..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 This AI understands YOUR document, not just generic legal terms
          </p>
        </div>
      </div>
    </div>
  )
}
