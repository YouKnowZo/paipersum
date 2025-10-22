// Professional animated logo component
export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex items-center gap-3">
      {/* Animated icon */}
      <div className={`${sizes[size]} relative group cursor-pointer`}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-green rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
        
        {/* Icon */}
        <div className="relative w-full h-full bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
          <svg className="w-2/3 h-2/3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" className="text-brand-green" />
          </svg>
        </div>
      </div>

      {/* Text logo */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-none bg-gradient-to-r from-brand-blue to-blue-600 bg-clip-text text-transparent">
            PaiperSum
          </span>
          <span className="text-xs text-ink-500 leading-none mt-0.5">
            Legal, Simplified
          </span>
        </div>
      )}
    </div>
  )
}
