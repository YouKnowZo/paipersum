import logoMark from '../assets/paipersum-logo.svg'

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${iconSizes[size]} relative rounded-2xl bg-gradient-to-br from-brand-gold to-brand-blue overflow-hidden shadow-lg flex items-center justify-center`}
      >
        <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
        <img src={logoMark} alt="PaiperSum monogram" className="w-3/4" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>
      </div>

      {size !== 'sm' && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-signature tracking-tight text-brand-blue ${textSizes[size]} drop-shadow-sm`}
          >
            pai
            <span className="relative text-brand-blue">
              per
              <span className="absolute -top-1 left-3 w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_6px_rgba(35,181,189,0.45)]"></span>
            </span>
            <span className="text-brand-gold">Sum</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.4em] text-ink-500 mt-1">
            contracts simplified
          </span>
        </div>
      )}
    </div>
  )
}
