// Professional paiperSum logo component
export default function Logo({ size = 'md', showTagline = true }: { size?: 'sm' | 'md' | 'lg', showTagline?: boolean }) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className="flex items-center gap-3">
      {/* paiperSum P icon */}
      <div className={`${iconSizes[size]} relative group cursor-pointer flex-shrink-0`}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-brand-navy rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
        
        {/* Icon */}
        <div className="relative w-full h-full">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg group-hover:drop-shadow-xl transition-all group-hover:scale-105">
            {/* Orange top section */}
            <path d="M30 10 C30 10, 50 0, 70 10 L70 40 C70 40, 50 50, 30 40 Z" fill="#F5A623" />
            
            {/* Navy bottom section */}
            <path d="M20 35 C20 35, 0 45, 0 65 L0 90 C0 90, 20 100, 40 90 L40 65 C40 65, 20 55, 20 35 Z" fill="#1E3A5F" />
            
            {/* Blue accent section */}
            <path d="M45 45 C45 45, 65 35, 85 45 L85 70 C85 70, 65 80, 45 70 Z" fill="#2C5F8D" />
            
            {/* White circle cutout */}
            <circle cx="25" cy="65" r="12" fill="white" />
            
            {/* Stylized P shape overlay */}
            <path d="M35 20 L35 85 M35 20 C35 20, 55 15, 65 25 C75 35, 75 45, 65 55 C55 65, 35 60, 35 60" 
                  stroke="#1E3A5F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.15"/>
          </svg>
        </div>
      </div>

      {/* Text logo */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <div className={`font-bold ${textSizes[size]} leading-none flex items-baseline`}>
            <span className="text-brand-navy">p</span>
            <span className="text-brand-orange">ai</span>
            <span className="text-brand-navy">per</span>
            <span className="text-brand-navy font-normal italic">Sum</span>
          </div>
          {showTagline && (
            <span className="text-xs text-ink-500 leading-none mt-1">
              Legal, Simplified
            </span>
          )}
        </div>
      )}
    </div>
  )
}
