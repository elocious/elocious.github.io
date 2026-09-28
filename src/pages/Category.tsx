import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { products, categories } from '@/data/mockData'
import ProductCard from '@/components/product/ProductCard'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { EmptyState } from '@/components/ui/Common'
import { ChevronDown } from 'lucide-react'

export default function Category() {
  const { id } = useParams()
  const category = categories.find(c => c.slug === id)
  const subcats = categories.filter(c => c.parentId === category?.id)
  const [sort, setSort] = useState('relevance')

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      if (category?.parentId === null) {
        const subIds = subcats.map(s => s.id)
        return subIds.includes(p.categoryId) || p.categoryId === category.id
      }
      return p.categoryId === category?.id
    })
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [id, sort])

  if (!category) {
    return <EmptyState icon={<ChevronDown className="w-8 h-8 text-muted" />} title="Category not found" message="This category may have been removed." action={<Link to="/products" className="btn btn-primary">Browse Products</Link>} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories', to: '/products' }, { label: category.name }]} />

      {/* Category hero */}
      <div className="card relative overflow-hidden p-8 mb-6 bg-gradient-to-r from-ink-900 to-ink-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />
        <div className="relative flex items-center gap-4">
          <img src={category.image} alt="" className="w-20 h-20 rounded-2xl object-cover" />
          <div>
            <h1 className="font-display font-bold text-3xl">{category.name}</h1>
            {category.description && <p className="text-muted mt-1">{category.description}</p>}
            <p className="text-sm text-gold-400 mt-1">{filtered.length} products</p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {subcats.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {subcats.map(s => (
            <Link key={s.id} to={`/category/${s.slug}`} className="card card-hover px-4 py-2 text-sm whitespace-nowrap shrink-0">{s.name}</Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-muted text-sm">{filtered.length} products</p>
        <div className="relative">
          <select value={sort} onChange={e => setSort(e.target.value)} className="input h-10 pr-8 appearance-none cursor-pointer text-sm">
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ChevronDown className="w-8 h-8 text-muted" />} title="No products in this category" message="Check back soon for new arrivals!" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  )
}
