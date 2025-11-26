// Professional animated logo component using PaiperSum branding
export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  }

  return (
    <div className="flex items-center">
      <img 
        src="/paipersum-logo.png" 
        alt="PaiperSum" 
        className={`${sizes[size]} object-contain transition-transform hover:scale-105`}
      />
    </div>
  )
}
