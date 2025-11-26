import { useEffect, useState } from 'react'

interface Props {
  show: boolean
  type: 'savings' | 'milestone' | 'share'
  amount?: number
  milestone?: number
  onClose: () => void
}

export default function CelebrationModal({ show, type, amount, milestone, onClose }: Props) {
  const [confetti, setConfetti] = useState<Array<{id: number, left: number, delay: number}>>([])

  useEffect(() => {
    if (show) {
      // Generate confetti
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
      setConfetti(pieces)

      // Auto-close after 5 seconds
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const messages = {
    savings: {
      emoji: '💰',
      title: `You Just Saved $${amount}!`,
      subtitle: 'That\'s real money back in your pocket',
      action: 'Share Your Win',
      color: 'from-brand-gold to-brand-green'
    },
    milestone: {
      emoji: '🎉',
      title: `${milestone} Documents Analyzed!`,
      subtitle: 'You\'re officially a contract pro',
      action: 'Unlock Your Badge',
      color: 'from-brand-blue to-brand-blue-dark'
    },
    share: {
      emoji: '🙌',
      title: 'You Helped Someone!',
      subtitle: 'Your friend just saved money thanks to you',
      action: 'Share More',
      color: 'from-brand-blue to-brand-gold'
    }
  }

  const config = messages[type]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-gradient-to-br from-brand-gold to-brand-blue rounded-full animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animationDelay: `${piece.delay}s`,
            animation: 'confetti 3s ease-out forwards'
          }}
        />
      ))}

      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl animate-in zoom-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Animated emoji */}
        <div className="text-8xl mb-6 animate-bounce">
          {config.emoji}
        </div>

        {/* Title */}
        <h2 className={`text-4xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent mb-4`}>
          {config.title}
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-ink-600 mb-8">
          {config.subtitle}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-paper-50 rounded-2xl">
          <div>
            <div className="text-2xl font-bold text-brand-blue">#{Math.floor(Math.random() * 1000)}</div>
            <div className="text-xs text-ink-500">Your Rank</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-green">{amount || milestone}</div>
            <div className="text-xs text-ink-500">{type === 'savings' ? 'Saved' : 'Docs'}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-gold">Top 5%</div>
            <div className="text-xs text-ink-500">Users</div>
          </div>
        </div>

        {/* Action button */}
        <button className={`w-full px-8 py-4 bg-gradient-to-r ${config.color} text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105`}>
          {config.action} →
        </button>

        {/* Social proof */}
        <p className="text-xs text-ink-500 mt-6">
          Join 2,847 users who shared their wins this week
        </p>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
