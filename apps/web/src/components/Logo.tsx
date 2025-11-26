// PaiperSum branded logo component
export default function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', tagline: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', tagline: 'text-xs' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', tagline: 'text-sm' }
  }

  return (
    <div className="flex items-center gap-2.5">
      {/* PaiperSum P Icon - stylized speech bubble P with orange accent */}
      <div className={`${sizes[size].icon} relative group cursor-pointer flex-shrink-0`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none"
        >
          {/* Speech bubble tail / pointer */}
          <path
            d="M15 85 L5 95 L15 75 Z"
            fill="#1e3a5f"
          />
          
          {/* Main P body - navy blue */}
          <path
            d="M15 10 L15 75 L30 75 L30 55 L50 55 C50 55 70 55 70 37.5 C70 20 50 20 50 20 L30 20 L30 10 Z"
            fill="#1e3a5f"
          />
          
          {/* P inner cutout - white space */}
          <path
            d="M30 28 L30 47 L45 47 C45 47 58 47 58 37.5 C58 28 45 28 45 28 Z"
            fill="white"
          />
          
          {/* Orange accent - top right corner fold */}
          <path
            d="M55 10 L85 10 L85 40 C85 40 85 10 55 10 Z"
            fill="#f5a623"
          />
          
          {/* Orange accent triangle */}
          <path
            d="M60 8 L92 8 L92 35 Z"
            fill="#f5a623"
          />
        </svg>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-brand-orange/20 rounded-lg opacity-0 group-hover:opacity-100 blur-lg transition-opacity"></div>
      </div>

      {/* Text logo */}
      {showText && size !== 'sm' && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} leading-none tracking-tight`} style={{ fontFamily: "'Pacifico', cursive" }}>
            <span className="text-brand-navy">p</span>
            <span className="text-brand-orange">ai</span>
            <span className="text-brand-navy">perSum</span>
          </span>
          <span className={`${sizes[size].tagline} text-ink-500 leading-none mt-1`}>
            Legal, Simplified
          </span>
        </div>
      )}
      
      {/* Small size just shows icon with tooltip-like text on hover */}
      {showText && size === 'sm' && (
        <span className="font-bold text-sm leading-none tracking-tight" style={{ fontFamily: "'Pacifico', cursive" }}>
          <span className="text-brand-navy">p</span>
          <span className="text-brand-orange">ai</span>
          <span className="text-brand-navy">perSum</span>
        </span>
      )}
    </div>
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
      {/* Speech bubble tail */}
      <path
        d="M15 85 L5 95 L15 75 Z"
        fill="#1e3a5f"
      />
      
      {/* Main P body - navy */}
      <path
        d="M15 10 L15 75 L30 75 L30 55 L50 55 C50 55 70 55 70 37.5 C70 20 50 20 50 20 L30 20 L30 10 Z"
        fill="#1e3a5f"
      />
      
      {/* P inner cutout */}
      <path
        d="M30 28 L30 47 L45 47 C45 47 58 47 58 37.5 C58 28 45 28 45 28 Z"
        fill="white"
      />
      
      {/* Orange accent */}
      <path
        d="M60 8 L92 8 L92 35 Z"
        fill="#f5a623"
      />
    </svg>
  )
}
