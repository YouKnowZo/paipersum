const items = [
  { label: 'Documents', icon: '📄', href: '/' },
  { label: 'Scans', icon: '🛡️', href: '/scans' },
  { label: 'Templates', icon: '📚', href: '/templates' },
  { label: 'Settings', icon: '⚙️', href: '/settings' }
]

export default function Sidebar({ active = 'Documents' }: { active?: string }) {
  return (
    <nav className="bg-paper-0 border rounded-xl shadow-sm p-2">
      {items.map(item => (
        <button 
          key={item.label}
          className={`
            w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg 
            transition-colors duration-150
            ${active === item.label 
              ? 'bg-brand-blue/10 text-brand-blue font-medium' 
              : 'hover:bg-paper-100 text-ink-700'
            }
          `}
        >
          <span className="text-lg" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
