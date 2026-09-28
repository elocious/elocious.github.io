import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MessageCircle, Send, Headphones, ChevronDown, Plus, Mail, Phone, Clock, HelpCircle, Bot } from 'lucide-react'
import { faqs, supportTickets } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Badge, EmptyState } from '@/components/ui/Common'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { formatDate } from '@/lib/utils'

export default function Support() {
  const { showToast } = useStore()
  const [tab, setTab] = useState('faq')
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([
    { from: 'bot', text: 'Hi! I\'m NexaBot, your AI support assistant. How can I help you today?' },
  ])
  const [chatInput, setChatInput] = useState('')

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))

  const sendChat = () => {
    if (!chatInput.trim()) return
    const msg = chatInput
    setChatMessages(prev => [...prev, { from: 'user', text: msg }])
    setChatInput('')
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'bot', text: 'Thanks for your question! I\'m connecting you with relevant help articles. For more complex issues, please create a support ticket and our team will assist you within 24 hours.' }])
    }, 800)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Support' }]} />

      <div className="card relative overflow-hidden p-8 mb-6 bg-gradient-to-br from-ink-900 to-ink-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />
        <div className="relative">
          <h1 className="font-display font-bold text-3xl mb-2">How can we help?</h1>
          <p className="text-muted mb-4">Search our help center or contact our support team</p>
          <div className="relative max-w-xl">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for help..." className="input pl-11 h-12 text-base" />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Bot, label: 'AI Assistant', desc: 'Get instant help', action: () => setTab('chat') },
          { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with agent', action: () => showToast('info', 'Live chat would connect you to an agent') },
          { icon: Mail, label: 'Email Us', desc: 'support@nexacart.com', action: () => showToast('info', 'Email client would open') },
          { icon: Phone, label: 'Call Us', desc: '+1 (800) 639-2278', action: () => showToast('info', 'Calling NexaCart support...') },
        ].map(a => (
          <button key={a.label} onClick={a.action} className="card card-hover p-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-2"><a.icon className="w-5 h-5" /></div>
            <p className="font-medium text-sm">{a.label}</p>
            <p className="text-xs text-muted">{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-base mb-6 overflow-x-auto no-scrollbar">
        {[{ k: 'faq', l: 'FAQ' }, { k: 'tickets', l: 'My Tickets' }, { k: 'chat', l: 'AI Assistant' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${tab === t.k ? 'border-gold-400 text-gold-400' : 'border-transparent text-muted hover:text-foreground'}`}>{t.l}</button>
        ))}
      </div>

      {tab === 'faq' && (
        <div className="space-y-2">
          {filteredFaqs.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-sm flex items-center gap-2"><HelpCircle className="w-4 h-4 text-gold-400" /> {f.q}</span>
                <ChevronDown className={`w-4 h-4 transition shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm text-muted">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {filteredFaqs.length === 0 && <EmptyState icon={<Search className="w-8 h-8 text-muted" />} title="No results" message="Try a different search term." />}
        </div>
      )}

      {tab === 'tickets' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your Support Tickets</h2>
            <Button size="sm" onClick={() => setShowTicketForm(!showTicketForm)}><Plus className="w-4 h-4" /> New Ticket</Button>
          </div>
          <AnimatePresence>
            {showTicketForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card p-4 mb-4 overflow-hidden">
                <input className="input mb-2" placeholder="Subject" />
                <select className="input mb-2"><option>Returns</option><option>Products</option><option>Shipping</option><option>Account</option><option>Other</option></select>
                <textarea className="input resize-none h-24 mb-2" placeholder="Describe your issue..." />
                <Button size="sm" onClick={() => { setShowTicketForm(false); showToast('success', 'Ticket created! We\'ll respond within 24 hours.') }}>Submit Ticket</Button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-3">
            {supportTickets.map(t => (
              <div key={t.id} className="card p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-sm">{t.subject}</p>
                    <p className="text-xs text-muted mt-0.5">#{t.id} · {t.category} · Created {formatDate(t.createdAt)}</p>
                  </div>
                  <Badge variant={t.status === 'resolved' ? 'green' : t.status === 'open' ? 'gold' : 'default'} className="capitalize">{t.status}</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {t.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.from === 'user' ? 'bg-gold-500/10 text-foreground' : 'bg-elev text-muted'}`}>{m.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div className="card p-4 h-[500px] flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-base mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center"><Bot className="w-5 h-5 text-ink-950" /></div>
            <div><p className="font-medium text-sm">NexaBot AI Assistant</p><p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Online</p></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.from === 'user' ? 'bg-gold-500/15 text-foreground' : 'bg-elev text-muted'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-3 border-t border-base">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type your message..." className="input flex-1 h-10" />
            <Button onClick={sendChat} className="px-3"><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
