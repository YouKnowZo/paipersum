interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', tagline: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', tagline: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', tagline: 'text-sm' },
  }

  return (
    <div className="flex items-center gap-3">
      {/* Icon mark */}
      <div className={`${sizes[size].icon} relative group`}>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-brand-teal/20 rounded-xl blur-lg opacity-0 
                       group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon container */}
        <div className="relative w-full h-full bg-brand-navy rounded-xl flex items-center justify-center 
                       shadow-md group-hover:shadow-lg transition-all duration-300">
          {/* Document icon with checkmark */}
          <svg 
            className="w-[60%] h-[60%] text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          
          {/* Teal accent dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-teal rounded-full 
                         border-2 border-white shadow-sm" />
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-display font-bold tracking-tight text-slate-900`}>
            PaiperSum
          </span>
          {size !== 'sm' && (
            <span className={`${sizes[size].tagline} text-slate-500 -mt-0.5`}>
              Legal, Simplified
            </span>
          )}
        </div>
      )}
    </div>
  )
}
