import { useEffect, useState } from 'react'

interface Props {
  userName?: string
  docsAnalyzed: number
  totalSavings: number
}

export default function PersonalizedWelcome({ userName, docsAnalyzed, totalSavings }: Props) {
  const [timeOfDay, setTimeOfDay] = useState('')
  const [personalizedMessage, setPersonalizedMessage] = useState('')
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    // Check if first visit
    const hasVisited = localStorage.getItem('paipersum_visited')
    if (!hasVisited) {
      setIsFirstVisit(true)
      localStorage.setItem('paipersum_visited', 'true')
    }

    // Generate personalized message
    if (docsAnalyzed === 0) {
      setPersonalizedMessage("We're excited to help you protect your money 💰")
    } else if (docsAnalyzed < 5) {
      setPersonalizedMessage(`You're already smarter than 78% of people who sign blind 🧠`)
    } else if (docsAnalyzed < 10) {
      setPersonalizedMessage(`You're becoming a contract expert! Keep going 🚀`)
    } else {
      setPersonalizedMessage(`You're a PaiperSum power user! You inspire us 💎`)
    }
  }, [docsAnalyzed])

  if (!isFirstVisit && docsAnalyzed === 0) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4">
      <div className="glass-card px-6 py-4 rounded-2xl shadow-2xl max-w-md mx-4">
        <div className="flex items-start gap-4">
          {/* Animated avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-yellow rounded-full flex items-center justify-center text-white text-xl font-bold animate-glow">
              {userName ? userName[0].toUpperCase() : '👋'}
            </div>
            {docsAnalyzed > 0 && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-green rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                {docsAnalyzed}
              </div>
            )}
          </div>

          {/* Message */}
          <div className="flex-1">
            <div className="font-semibold text-ink-900 mb-1">
              Good {timeOfDay}{userName ? `, ${userName}` : ''}! ✨
            </div>
            <div className="text-sm text-ink-600">
              {personalizedMessage}
            </div>
            
            {totalSavings > 0 && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-brand-green/10 text-brand-green rounded-full font-semibold">
                  💰 ${totalSavings.toLocaleString()} protected
                </span>
              </div>
            )}
          </div>

          {/* Close button */}
          <button className="text-ink-400 hover:text-ink-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
