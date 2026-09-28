import { useState } from 'react'
import { Store, Upload, Save, Globe, Bell, Shield } from 'lucide-react'
import { stores } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Common'

export default function SellerSettings() {
  const { user, showToast } = useStore()
  const store = stores.find(s => s.sellerId === user?.id) || stores[0]
  const [form, setForm] = useState({ name: store.name, description: store.description, location: store.location })

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-2">Store Settings</h1>
      <p className="text-muted text-sm mb-6">Manage your store profile and preferences</p>

      {/* Store profile */}
      <div className="card p-6 mb-4">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Store className="w-4 h-4 text-gold-400" /> Store Profile</h2>
        <div className="flex items-center gap-4 mb-4">
          <img src={store.logo} alt="" className="w-20 h-20 rounded-2xl object-cover" />
          <div><Button variant="secondary" size="sm" onClick={() => showToast('info', 'File picker would open')}><Upload className="w-4 h-4" /> Change Logo</Button><p className="text-xs text-muted mt-1">Recommended: 400x400px</p></div>
        </div>
        <div className="space-y-3">
          <div><label className="text-sm font-medium block mb-1">Store Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Description</label><textarea className="input resize-none h-24" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Location</label><input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={store.verified ? 'green' : 'gold'}>{store.verified ? 'Verified Store' : 'Pending Verification'}</Badge>
          <span className="text-xs text-muted">Rating: {store.rating} · {store.followers.toLocaleString()} followers</span>
        </div>
      </div>

      {/* Banner */}
      <div className="card p-6 mb-4">
        <h2 className="font-semibold mb-4">Store Banner</h2>
        <div className="relative h-32 rounded-xl overflow-hidden bg-ink-800">
          <img src={store.banner} alt="" className="w-full h-full object-cover" />
          <button onClick={() => showToast('info', 'File picker would open')} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition"><span className="btn btn-primary"><Upload className="w-4 h-4" /> Change Banner</span></button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6 mb-4">
        <h2 className="font-semibold mb-4">Preferences</h2>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', desc: 'Get notified about new orders', icon: Bell },
            { label: 'Public store', desc: 'Make your store visible to customers', icon: Globe },
            { label: 'Two-factor auth', desc: 'Extra security for your account', icon: Shield },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-elev">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-ink-800 text-gold-400 flex items-center justify-center"><p.icon className="w-5 h-5" /></div><div><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted">{p.desc}</p></div></div>
              <button className="w-12 h-6 rounded-full bg-gold-400 relative"><span className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white transition" /></button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => showToast('success', 'Settings saved successfully')}><Save className="w-4 h-4" /> Save Changes</Button>
    </div>
  )
}
