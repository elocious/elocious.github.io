import { useState } from 'react'
import { User, Shield, Bell, MapPin, CreditCard, Trash2, Plus, Moon, Sun, Monitor, Check } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Common'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { cn } from '@/lib/utils'

export default function Settings() {
  const { user, addresses, addAddress, removeAddress, theme, setTheme, showToast } = useStore()
  const [tab, setTab] = useState('profile')
  const [notifPrefs, setNotifPrefs] = useState({ orders: true, promotions: true, priceDrop: true, backInStock: true, messages: true, security: true })

  if (!user) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Settings' }]} />
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-6">Settings</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="card p-2 h-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition', tab === t.id ? 'bg-gold-500/10 text-gold-400' : 'hover:bg-elev')}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {tab === 'profile' && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Personal Information</h2>
              <div className="flex items-center gap-4 mb-6">
                <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                <div><Button variant="secondary" size="sm" onClick={() => showToast('info', 'File picker would open')}>Change Photo</Button><p className="text-xs text-muted mt-1">JPG, PNG or GIF. Max 5MB.</p></div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className="text-sm font-medium block mb-1">Full Name</label><input className="input" defaultValue={user.name} /></div>
                <div><label className="text-sm font-medium block mb-1">Username</label><input className="input" defaultValue={user.username} /></div>
                <div><label className="text-sm font-medium block mb-1">Email</label><input className="input" defaultValue={user.email} /></div>
                <div><label className="text-sm font-medium block mb-1">Phone</label><input className="input" defaultValue={user.phone} /></div>
              </div>
              <Button className="mt-4" onClick={() => showToast('success', 'Profile updated successfully')}>Save Changes</Button>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Saved Addresses</h2>
                <Button size="sm" onClick={() => showToast('info', 'Address form would open')}><Plus className="w-4 h-4" /> Add Address</Button>
              </div>
              <div className="space-y-3">
                {addresses.map(a => (
                  <div key={a.id} className="card p-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><span className="font-medium text-sm">{a.label}</span>{a.isDefault && <Badge variant="gold">Default</Badge>}</div>
                      <p className="text-sm text-muted mt-1">{a.name} · {a.street}, {a.city}, {a.state} {a.zip}</p>
                      <p className="text-sm text-muted">{a.phone}</p>
                    </div>
                    <button onClick={() => { removeAddress(a.id); showToast('info', 'Address removed') }} className="text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'payment' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Payment Methods</h2>
                <Button size="sm" onClick={() => showToast('info', 'Add card form would open')}><Plus className="w-4 h-4" /> Add Card</Button>
              </div>
              <div className="space-y-3">
                {['Visa •••• 4242', 'Mastercard •••• 5555'].map(card => (
                  <div key={card} className="card p-4 flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-gold-400" />
                    <div className="flex-1"><p className="font-medium text-sm">{card}</p><p className="text-xs text-muted">Expires 12/27</p></div>
                    <Badge variant="green">Active</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-4 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gold-400" /> Your card information is encrypted and never stored in full.</p>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-3">
                {Object.entries(notifPrefs).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-elev cursor-pointer">
                    <div>
                      <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-xs text-muted">Get notified about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                    </div>
                    <button onClick={() => setNotifPrefs(p => ({ ...p, [key]: !val }))}
                      className={cn('w-12 h-6 rounded-full transition relative', val ? 'bg-gold-400' : 'bg-ink-800')}>
                      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition', val ? 'left-7' : 'left-1')} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="font-semibold mb-3">Change Password</h2>
                <div className="space-y-3 max-w-md">
                  <input type="password" className="input" placeholder="Current password" />
                  <input type="password" className="input" placeholder="New password" />
                  <input type="password" className="input" placeholder="Confirm new password" />
                  <Button onClick={() => showToast('success', 'Password changed successfully')}>Update Password</Button>
                </div>
              </div>
              <div className="border-t border-base pt-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-sm">Two-Factor Authentication</p><p className="text-xs text-muted">Add an extra layer of security</p></div>
                  <Button variant="secondary" size="sm" onClick={() => showToast('info', '2FA setup would begin')}>Enable</Button>
                </div>
              </div>
              <div className="border-t border-base pt-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-sm">Login Activity</p><p className="text-xs text-muted">Review recent logins</p></div>
                  <Button variant="secondary" size="sm" onClick={() => showToast('info', 'Login activity would show')}>View</Button>
                </div>
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Theme</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: 'dark', l: 'Dark', i: Moon },
                  { k: 'light', l: 'Light', i: Sun },
                  { k: 'system', l: 'System', i: Monitor },
                ].map(o => (
                  <button key={o.k} onClick={() => setTheme(o.k as 'dark' | 'light' | 'system')}
                    className={cn('card p-4 flex flex-col items-center gap-2 transition', theme === o.k ? 'border-gold-400 bg-gold-500/5' : '')}>
                    <o.i className="w-6 h-6" />
                    <span className="text-sm font-medium">{o.l}</span>
                    {theme === o.k && <Check className="w-4 h-4 text-gold-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
