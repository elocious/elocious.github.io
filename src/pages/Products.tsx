import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, Grid3x3, List } from 'lucide-react'
import { products, categories, brands, stores } from '@/data/mockData'
import ProductCard from '@/components/product/ProductCard'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { EmptyState, Skeleton } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import { formatPrice, paginate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

type SortKey = 'relevance' | 'newest' | 'popular' | 'price-low' | 'price-high' | 'rating' | 'discount'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState<SortKey>('relevance')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 3000,
    selectedBrands: [] as string[],
    selectedCategories: [] as string[],
    selectedStores: [] as string[],
    minRating: 0,
    condition: '' as string,
    inStockOnly: false,
    onSaleOnly: false,
  })

  const filterParam = params.get('filter')
  const searchQ = params.get('q') || ''
  const brandParam = params.get('brand')

  useEffect(() => {
    if (brandParam) setFilters(f => ({ ...f, selectedBrands: [brandParam] }))
  }, [brandParam])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [filters, sort, page, filterParam, searchQ])

  const filtered = useMemo(() => {
    let result = [...products]
    if (searchQ) {
      const q = searchQ.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))
    }
    if (filterParam === 'deals' || filterParam === 'flash') result = result.filter(p => p.flashSale || p.discount > 0)
    if (filterParam === 'trending') result = result.filter(p => p.trending)
    if (filterParam === 'best') result = result.filter(p => p.bestSeller)
    if (filterParam === 'new') result = result.filter(p => p.newArrival)

    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    if (filters.selectedBrands.length) result = result.filter(p => filters.selectedBrands.includes(p.brand))
    if (filters.selectedCategories.length) result = result.filter(p => filters.selectedCategories.includes(p.categoryId))
    if (filters.selectedStores.length) result = result.filter(p => filters.selectedStores.includes(p.storeId))
    if (filters.minRating) result = result.filter(p => p.rating >= filters.minRating)
    if (filters.condition) result = result.filter(p => p.condition === filters.condition)
    if (filters.inStockOnly) result = result.filter(p => p.stock > 0)
    if (filters.onSaleOnly) result = result.filter(p => p.discount > 0)

    switch (sort) {
      case 'newest': result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break
      case 'popular': result.sort((a, b) => b.sold - a.sold); break
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'discount': result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break
    }
    return result
  }, [filters, sort, filterParam, searchQ])

  const perPage = 12
  const totalPages = Math.ceil(filtered.length / perPage)
  const pageItems = paginate(filtered, page, perPage)

  const toggleBrand = (b: string) => setFilters(f => ({ ...f, selectedBrands: f.selectedBrands.includes(b) ? f.selectedBrands.filter(x => x !== b) : [...f.selectedBrands, b] }))
  const toggleCategory = (c: string) => setFilters(f => ({ ...f, selectedCategories: f.selectedCategories.includes(c) ? f.selectedCategories.filter(x => x !== c) : [...f.selectedCategories, c] }))
  const toggleStore = (s: string) => setFilters(f => ({ ...f, selectedStores: f.selectedStores.includes(s) ? f.selectedStores.filter(x => x !== s) : [...f.selectedStores, s] }))
  const clearFilters = () => setFilters({ minPrice: 0, maxPrice: 3000, selectedBrands: [], selectedCategories: [], selectedStores: [], minRating: 0, condition: '', inStockOnly: false, onSaleOnly: false })

  const activeFilterCount = filters.selectedBrands.length + filters.selectedCategories.length + filters.selectedStores.length + (filters.minRating > 0 ? 1 : 0) + (filters.condition ? 1 : 0) + (filters.inStockOnly ? 1 : 0) + (filters.onSaleOnly ? 1 : 0)

  const FilterPanel = () => (
    <div className="space-y-6">
      <FilterSection title="Price Range">
        <div className="space-y-2">
          <input type="range" min={0} max={3000} step={50} value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))} className="w-full accent-gold-400" />
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>{formatPrice(filters.maxPrice)}</span>
          </div>
        </div>
      </FilterSection>
      <FilterSection title="Brand">
        {brands.map(b => (
          <label key={b.id} className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
            <input type="checkbox" checked={filters.selectedBrands.includes(b.name)} onChange={() => toggleBrand(b.name)} className="accent-gold-400" />
            <span className="text-sm">{b.name}</span>
            <span className="text-xs text-muted ml-auto">{b.productCount}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Category">
        {categories.filter(c => c.parentId === null).map(c => (
          <label key={c.id} className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
            <input type="checkbox" checked={filters.selectedCategories.includes(c.id)} onChange={() => toggleCategory(c.id)} className="accent-gold-400" />
            <span className="text-sm">{c.name}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Store">
        {stores.map(s => (
          <label key={s.id} className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
            <input type="checkbox" checked={filters.selectedStores.includes(s.id)} onChange={() => toggleStore(s.id)} className="accent-gold-400" />
            <span className="text-sm">{s.name}</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Rating">
        {[4, 3, 2, 1].map(r => (
          <label key={r} className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
            <input type="radio" name="rating" checked={filters.minRating === r} onChange={() => setFilters(f => ({ ...f, minRating: r }))} className="accent-gold-400" />
            <span className="text-sm">{r}★ & up</span>
          </label>
        ))}
      </FilterSection>
      <FilterSection title="Availability">
        <label className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
          <input type="checkbox" checked={filters.inStockOnly} onChange={() => setFilters(f => ({ ...f, inStockOnly: !f.inStockOnly }))} className="accent-gold-400" />
          <span className="text-sm">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
          <input type="checkbox" checked={filters.onSaleOnly} onChange={() => setFilters(f => ({ ...f, onSaleOnly: !f.onSaleOnly }))} className="accent-gold-400" />
          <span className="text-sm">On Sale Only</span>
        </label>
      </FilterSection>
      <FilterSection title="Condition">
        {['New', 'Refurbished', 'Used'].map(c => (
          <label key={c} className="flex items-center gap-2 py-1 cursor-pointer hover:text-gold-400 transition">
            <input type="radio" name="condition" checked={filters.condition === c} onChange={() => setFilters(f => ({ ...f, condition: c }))} className="accent-gold-400" />
            <span className="text-sm">{c}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">
            {filterParam === 'deals' ? '⚡ Deals & Flash Sales' : searchQ ? `Results for "${searchQ}"` : 'All Products'}
          </h1>
          <p className="text-muted text-sm mt-1">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} className="btn btn-secondary p-2.5 hidden md:flex">
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
          </button>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="input h-10 pr-8 appearance-none cursor-pointer text-sm">
              <option value="relevance">Sort: Relevance</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <button onClick={() => setShowFilters(true)} className="btn btn-secondary lg:hidden relative">
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 text-ink-950 text-xs font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-gold-400 hover:underline">Clear all</button>}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<SlidersHorizontal className="w-8 h-8 text-muted" />}
              title="No products found"
              message="Try adjusting your filters or search terms to find what you're looking for."
              action={<Button onClick={clearFilters}>Clear Filters</Button>}
            />
          ) : (
            <>
              <div className={view === 'grid' ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3" : "space-y-3"}>
                {pageItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setShowFilters(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-base z-50 lg:hidden overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <FilterPanel />
              <Button className="w-full mt-6" onClick={() => setShowFilters(false)}>Show {filtered.length} Results</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-base pb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-2">
        <span className="font-medium text-sm">{title}</span>
        <ChevronDown className={`w-4 h-4 transition ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}
