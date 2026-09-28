import { useSearchParams, Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { products, categories, stores } from '@/data/mockData'
import ProductCard from '@/components/product/ProductCard'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { EmptyState } from '@/components/ui/Common'
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const { searchQuery, setSearchQuery } = useStore()
  const [input, setInput] = useState(params.get('q') || searchQuery || '')
  const [loading, setLoading] = useState(true)

  const q = params.get('q') || ''

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [q])

  const results = useMemo(() => {
    if (!q) return []
    const query = q.toLowerCase()
    return products.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.includes(query))
    )
  }, [q])

  const trendingSearches = ['Headphones', 'Laptop', 'Phone', 'Watch', 'Skincare', 'Gaming']

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setParams({ q: input })
    setSearchQuery(input)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />

      <form onSubmit={handleSearch} className="relative mb-6">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Search for products, brands, stores..." className="input pl-12 h-12 text-lg" autoFocus />
        <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        {input && <button type="button" onClick={() => setInput('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-5 h-5 text-muted" /></button>}
      </form>

      {!q ? (
        <div className="space-y-8">
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold-400" /> Trending Searches</h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map(s => (
                <button key={s} onClick={() => { setInput(s); setParams({ q: s }) }} className="card card-hover px-4 py-2 text-sm">{s}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-3">Browse Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.filter(c => c.parentId === null).map(c => (
                <Link key={c.id} to={`/category/${c.slug}`} className="card card-hover p-4 flex items-center gap-3">
                  <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm font-medium">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="w-8 h-8 text-muted" />}
          title={`No results for "${q}"`}
          message="Try different keywords or browse our categories."
          action={<Link to="/products" className="btn btn-primary">Browse All Products</Link>}
        />
      ) : (
        <>
          <p className="text-muted text-sm mb-4">{results.length} results for "<span className="text-foreground font-medium">{q}</span>"</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </>
      )}
    </div>
  )
}
