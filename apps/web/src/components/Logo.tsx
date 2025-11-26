// Professional animated logo component
export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const imageSizes = {
    sm: 'w-8 h-8',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto'
  }

  return (
    <div className="flex items-center gap-3">
      {/* Logo image */}
      <div className={`${imageSizes[size]} relative group cursor-pointer`}>
        <img 
          src="/paipersum-logo.png" 
          alt="PaiperSum Logo" 
          className={`${imageSizes[size]} object-contain transition-all group-hover:scale-105`}
        />
      </div>

      {/* Text logo */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-none bg-gradient-to-r from-brand-blue to-brand-blue-light bg-clip-text text-transparent">
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
