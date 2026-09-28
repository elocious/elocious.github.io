import { useState } from 'react'
import { Search, Ban, Check, MoreVertical, Users as UsersIcon } from 'lucide-react'
import { users } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { Badge, EmptyState } from '@/components/ui/Common'
import { formatDate } from '@/lib/utils'

const allUsers = [
  ...users,
  { id: 'u5', name: 'Emma Wilson', username: 'emmaw', email: 'emma@example.com', avatar: `https://picsum.photos/seed/emma/200/200`, role: 'customer', points: 340, loyaltyTier: 'Silver', referralCode: 'EMMA-2024', joinedAt: '2024-02-10' },
  { id: 'u6', name: 'James Park', username: 'jamesp', email: 'james@example.com', avatar: `https://picsum.photos/seed/james/200/200`, role: 'customer', points: 1200, loyaltyTier: 'Gold', referralCode: 'JAMES-2024', joinedAt: '2024-03-20' },
  { id: 'u7', name: 'Lisa Brown', username: 'lisab', email: 'lisa@example.com', avatar: `https://picsum.photos/seed/lisa/200/200`, role: 'seller', points: 0, loyaltyTier: 'Bronze', referralCode: 'LISA-2024', joinedAt: '2024-04-15' },
  { id: 'u8', name: 'Tom Garcia', username: 'tomg', email: 'tom@example.com', avatar: `https://picsum.photos/seed/tom/200/200`, role: 'customer', points: 890, loyaltyTier: 'Silver', referralCode: 'TOM-2024', joinedAt: '2024-05-01' },
  { id: 'u9', name: 'Nina Patel', username: 'ninap', email: 'nina@example.com', avatar: `https://picsum.photos/seed/nina/200/200`, role: 'customer', points: 2100, loyaltyTier: 'Gold', referralCode: 'NINA-2024', joinedAt: '2024-06-12' },
  { id: 'u10', name: 'Chris Lee', username: 'chrisl', email: 'chris@example.com', avatar: `https://picsum.photos/seed/chris/200/200`, role: 'customer', points: 50, loyaltyTier: 'Bronze', referralCode: 'CHRIS-2024', joinedAt: '2024-07-08' },
]

export default function AdminUsers() {
  const { showToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = allUsers.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && u.role !== filter) return false
    return true
  })

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">User Management</h1>
      <p className="text-muted text-sm mb-6">{allUsers.length} total users</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input pl-10 h-10" />
        </div>
        <div className="flex gap-1">
          {['all', 'customer', 'seller', 'admin'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elev">
              <tr className="text-left text-xs text-muted">
                <th className="p-3 font-medium">User</th>
                <th className="p-3 font-medium hidden md:table-cell">Email</th>
                <th className="p-3 font-medium hidden sm:table-cell">Joined</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium hidden lg:table-cell">Points</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-base hover:bg-elev transition">
                  <td className="p-3"><div className="flex items-center gap-2"><img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /><div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted">@{u.username}</p></div></div></td>
                  <td className="p-3 text-sm hidden md:table-cell">{u.email}</td>
                  <td className="p-3 text-sm hidden sm:table-cell">{formatDate(u.joinedAt)}</td>
                  <td className="p-3"><Badge variant={u.role === 'admin' ? 'gold' : u.role === 'seller' ? 'blue' : 'default'} className="capitalize">{u.role}</Badge></td>
                  <td className="p-3 text-sm hidden lg:table-cell">{u.points}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => showToast('success', 'User verified')} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-emerald-400"><Check className="w-4 h-4" /></button>
                      <button onClick={() => showToast('info', 'User suspended')} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-red-400"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filtered.length === 0 && <EmptyState icon={<UsersIcon className="w-8 h-8 text-muted" />} title="No users found" message="Try a different search." />}
    </div>
  )
}
