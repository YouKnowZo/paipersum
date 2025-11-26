// Professional animated logo component
export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`${iconSizes[size]} rounded-2xl shadow-lg ring-1 ring-brand-blue/10 overflow-hidden bg-paper-0`}>
        <img
          src="/paipersum-logo.svg"
          alt="PaiperSum monogram"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {size !== 'sm' && (
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-[1.35rem] tracking-tight text-brand-blue lowercase">
            pai<span className="text-brand-yellow">per</span>
            <span className="text-brand-blue">S</span>
            <span className="text-brand-yellow">um</span>
          </span>
          <span className="text-xs text-ink-500 uppercase tracking-[0.2em] mt-0.5">
            Legal clarity
          </span>
        </div>
      )}
    </div>
  )
}
