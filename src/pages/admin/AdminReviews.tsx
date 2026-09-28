import { useState } from 'react'
import { Search, Flag, Check, Trash2, Star } from 'lucide-react'
import { reviews } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { Badge, EmptyState, Rating } from '@/components/ui/Common'
import { formatDate } from '@/lib/utils'

export default function AdminReviews() {
  const { showToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = reviews.filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.body.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'reported' && !r.reported) return false
    if (filter === 'verified' && !r.verified) return false
    return true
  })

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">Review Moderation</h1>
      <p className="text-muted text-sm mb-6">{reviews.length} reviews · {reviews.filter(r => r.reported).length} reported</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="input pl-10 h-10" />
        </div>
        <div className="flex gap-1">
          {['all', 'verified', 'reported'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="card p-4">
            <div className="flex items-start gap-3">
              <img src={r.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{r.userName}</p>
                  {r.verified && <Badge variant="green"><Check className="w-3 h-3" /> Verified</Badge>}
                  {r.reported && <Badge variant="red"><Flag className="w-3 h-3" /> Reported</Badge>}
                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                </div>
                <Rating value={r.rating} size="sm" />
                <p className="font-semibold text-sm mt-1">{r.title}</p>
                <p className="text-sm text-muted mt-0.5">{r.body}</p>
                <p className="text-xs text-muted mt-1">Product ID: {r.productId} · {r.helpful} found helpful</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => showToast('success', 'Review approved')} className="p-2 rounded-lg hover:bg-ink-800 text-muted hover:text-emerald-400"><Check className="w-4 h-4" /></button>
                <button onClick={() => showToast('info', 'Review removed')} className="p-2 rounded-lg hover:bg-ink-800 text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <EmptyState icon={<Star className="w-8 h-8 text-muted" />} title="No reviews found" message="Try a different filter." />}
    </div>
  )
}
