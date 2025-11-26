// PaiperSum branded logo component - matches official branding
export default function Logo({ size = 'md', showText = true, onClick }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean; onClick?: () => void }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', tagline: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', tagline: 'text-xs' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', tagline: 'text-sm' }
  }

  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
      aria-label="Go to home"
    >
      {/* PaiperSum P Icon - matches official logo */}
      <div className={`${sizes[size].icon} relative group cursor-pointer flex-shrink-0`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none"
        >
          {/* Main P shape with speech bubble - navy blue */}
          <path
            d="M8 15 
               C8 8, 15 5, 25 5
               L55 5
               C75 5, 85 15, 85 30
               C85 45, 75 55, 55 55
               L32 55
               L32 75
               C32 80, 28 82, 25 82
               L20 82
               C15 82, 12 80, 12 75
               L12 55
               L8 55
               L8 15
               Z"
            fill="#1e3a5f"
          />
          
          {/* Speech bubble pointer - bottom left */}
          <path
            d="M8 70 L8 82 L0 95 L12 82 L12 70 Z"
            fill="#1e3a5f"
          />
          
          {/* P inner cutout - white rounded bowl */}
          <path
            d="M32 20
               L50 20
               C62 20, 68 26, 68 35
               C68 44, 62 50, 50 50
               L32 50
               L32 20
               Z"
            fill="white"
          />
          
          {/* Orange accent - top right triangle */}
          <path
            d="M60 0 L100 0 L100 40 Z"
            fill="#f5a623"
          />
        </svg>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-brand-orange/20 rounded-lg opacity-0 group-hover:opacity-100 blur-lg transition-opacity"></div>
      </div>

      {/* Text logo - script style */}
      {showText && size !== 'sm' && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} leading-none`} style={{ fontFamily: "'Pacifico', cursive" }}>
            <span className="text-brand-navy">p</span>
            <span className="text-brand-orange">ai</span>
            <span className="text-brand-navy">perSum</span>
          </span>
          <span className={`${sizes[size].tagline} text-ink-500 leading-none mt-1`}>
            Legal, Simplified
          </span>
        </div>
      )}
      
      {/* Small size text */}
      {showText && size === 'sm' && (
        <span className="font-bold text-sm leading-none" style={{ fontFamily: "'Pacifico', cursive" }}>
          <span className="text-brand-navy">p</span>
          <span className="text-brand-orange">ai</span>
          <span className="text-brand-navy">perSum</span>
        </span>
      )}
    </button>
  )
}

// Standalone P icon component for favicon/small uses
export function PaiperSumIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
    >
      {/* Main P shape with speech bubble */}
      <path
        d="M8 15 
           C8 8, 15 5, 25 5
           L55 5
           C75 5, 85 15, 85 30
           C85 45, 75 55, 55 55
           L32 55
           L32 75
           C32 80, 28 82, 25 82
           L20 82
           C15 82, 12 80, 12 75
           L12 55
           L8 55
           L8 15
           Z"
        fill="#1e3a5f"
      />
      
      {/* Speech bubble pointer */}
      <path
        d="M8 70 L8 82 L0 95 L12 82 L12 70 Z"
        fill="#1e3a5f"
      />
      
      {/* P inner cutout */}
      <path
        d="M32 20
           L50 20
           C62 20, 68 26, 68 35
           C68 44, 62 50, 50 50
           L32 50
           L32 20
           Z"
        fill="white"
      />
      
      {/* Orange accent */}
      <path
        d="M60 0 L100 0 L100 40 Z"
        fill="#f5a623"
      />
    </svg>
  )
}
