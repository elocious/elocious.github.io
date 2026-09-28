import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted py-3 overflow-x-auto no-scrollbar">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 shrink-0">
          {item.to ? (
            <Link to={item.to} className="hover:text-gold-400 transition">{item.label}</Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      ))}
    </nav>
  )
}
