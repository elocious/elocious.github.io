import { useState } from 'react'
import { Save, Shield, Globe, Bell, Database, Key } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Common'

export default function AdminSettings() {
  const { showToast } = useStore()
  const [tab, setTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-2">Platform Settings</h1>
      <p className="text-muted text-sm mb-6">Configure platform-wide settings</p>

      <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}><t.icon className="w-4 h-4" /> {t.label}</button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="card p-6 space-y-4">
          <div><label className="text-sm font-medium block mb-1">Platform Name</label><input className="input" defaultValue="NexaCart" /></div>
          <div><label className="text-sm font-medium block mb-1">Support Email</label><input className="input" defaultValue="support@nexacart.com" /></div>
          <div><label className="text-sm font-medium block mb-1">Commission Rate (%)</label><input type="number" className="input" defaultValue="10" /></div>
          <div><label className="text-sm font-medium block mb-1">Minimum Order Amount</label><input type="number" className="input" defaultValue="1" /></div>
          <Button onClick={() => showToast('success', 'Settings saved')}><Save className="w-4 h-4" /> Save</Button>
        </div>
      )}

      {tab === 'security' && (
        <div className="card p-6 space-y-4">
          {[
            { label: 'Require Email Verification', desc: 'New users must verify email', on: true },
            { label: 'Admin 2FA Required', desc: 'Admins must use two-factor auth', on: true },
            { label: 'Rate Limiting', desc: 'Protect against brute force attacks', on: true },
            { label: 'Audit Logging', desc: 'Log all admin actions', on: true },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-elev">
              <div><p className="text-sm font-medium">{s.label}</p><p className="text-xs text-muted">{s.desc}</p></div>
              <button className={`w-12 h-6 rounded-full transition relative ${s.on ? 'bg-gold-400' : 'bg-ink-800'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${s.on ? 'left-7' : 'left-1'}`} /></button>
            </div>
          ))}
          <div className="p-3 bg-elev rounded-lg flex items-center gap-2">
            <Key className="w-4 h-4 text-gold-400" />
            <p className="text-xs text-muted">API keys and secrets are managed via environment variables and never exposed in frontend code.</p>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card p-6 space-y-3">
          {['New seller applications', 'Reported reviews', 'High-value orders', 'System alerts', 'Security incidents'].map(n => (
            <div key={n} className="flex items-center justify-between p-3 rounded-lg hover:bg-elev">
              <span className="text-sm font-medium">{n}</span>
              <button className="w-12 h-6 rounded-full bg-gold-400 relative"><span className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'system' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between"><span className="text-sm font-medium">Database Status</span><Badge variant="green">Healthy</Badge></div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium">API Status</span><Badge variant="green">Operational</Badge></div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium">Cache Status</span><Badge variant="green">Active</Badge></div>
          <div className="flex items-center justify-between"><span className="text-sm font-medium">Storage Used</span><span className="text-sm text-muted">4.2 TB / 10 TB</span></div>
          <Button variant="secondary" onClick={() => showToast('info', 'Cache cleared')}><Database className="w-4 h-4" /> Clear Cache</Button>
        </div>
      )}
    </div>
  )
}
