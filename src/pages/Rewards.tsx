import { Link } from 'react-router-dom'
import { Award, Sparkles, Gift, TrendingUp, Users, Star, ChevronRight, Zap } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Badge } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { formatDate } from '@/lib/utils'

const tiers = [
  { name: 'Bronze', min: 0, color: 'from-amber-700 to-amber-900', perks: ['1x points', 'Birthday gift'] },
  { name: 'Silver', min: 1000, color: 'from-gray-400 to-gray-600', perks: ['1.5x points', 'Free shipping', 'Early access'] },
  { name: 'Gold', min: 2000, color: 'from-gold-400 to-gold-600', perks: ['2x points', 'Priority support', 'Exclusive deals', 'Free returns'] },
  { name: 'Platinum', min: 5000, color: 'from-purple-400 to-purple-600', perks: ['3x points', 'Personal shopper', 'VIP events', 'Concierge support'] },
]

const rewards = [
  { name: '$10 Off Coupon', cost: 500, icon: Gift },
  { name: '$25 Off Coupon', cost: 1200, icon: Gift },
  { name: 'Free Shipping Pass', cost: 300, icon: Gift },
  { name: 'Exclusive Product Access', cost: 2000, icon: Star },
  { name: 'VIP Customer Support', cost: 1000, icon: Award },
  { name: 'Mystery Gift Box', cost: 3000, icon: Gift },
]

const transactions = [
  { type: 'earned', desc: 'Order NC-ORD-2024-003', amount: 78, date: '2024-09-27' },
  { type: 'earned', desc: 'Order NC-ORD-2024-002', amount: 299, date: '2024-09-25' },
  { type: 'earned', desc: 'Product review', amount: 50, date: '2024-09-20' },
  { type: 'redeemed', desc: '$10 off coupon', amount: -500, date: '2024-09-15' },
  { type: 'earned', desc: 'Order NC-ORD-2024-001', amount: 1298, date: '2024-09-15' },
  { type: 'earned', desc: 'Referral bonus', amount: 200, date: '2024-09-10' },
]

export default function Rewards() {
  const { user, showToast } = useStore()
  if (!user) return null

  const currentTier = tiers.find(t => t.name === user.loyaltyTier)!
  const nextTier = tiers[tiers.findIndex(t => t.name === user.loyaltyTier) + 1]
  const progress = nextTier ? ((user.points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Rewards' }]} />

      {/* Points balance */}
      <div className="card relative overflow-hidden p-8 mb-6 bg-gradient-to-br from-ink-900 to-ink-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/15 rounded-full blur-[100px]" />
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Badge variant="gold" className="mb-2"><Award className="w-3 h-3" /> {user.loyaltyTier} Member</Badge>
              <p className="text-muted text-sm">Your Points Balance</p>
              <p className="font-display font-bold text-5xl gradient-text mt-1">{user.points.toLocaleString()}</p>
              <p className="text-xs text-muted mt-1">≈ ${(user.points / 100).toFixed(2)} in rewards value</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => showToast('info', 'Share your referral link!')}><Users className="w-4 h-4" /> Refer & Earn</Button>
            </div>
          </div>

          {/* Tier progress */}
          {nextTier && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted">{currentTier.name}</span>
                <span className="text-gold-400">{nextTier.min - user.points} points to {nextTier.name}</span>
              </div>
              <div className="h-3 rounded-full bg-ink-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tier overview */}
      <h2 className="font-display font-bold text-xl mb-4">Loyalty Tiers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {tiers.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 0.05}>
            <div className={`card p-4 text-center ${user.loyaltyTier === t.name ? 'border-gold-400' : ''}`}>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} mx-auto mb-2 flex items-center justify-center`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="font-display font-bold">{t.name}</p>
              <p className="text-xs text-muted">{t.min.toLocaleString()}+ pts</p>
              <div className="mt-2 space-y-0.5">
                {t.perks.map(p => <p key={p} className="text-[10px] text-muted flex items-center justify-center gap-1"><Sparkles className="w-2.5 h-2.5 text-gold-400" /> {p}</p>)}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Redeem rewards */}
      <h2 className="font-display font-bold text-xl mb-4">Redeem Points</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {rewards.map((r, i) => (
          <ScrollReveal key={r.name} delay={i * 0.05}>
            <div className="card card-hover p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto mb-2"><r.icon className="w-6 h-6" /></div>
              <p className="font-medium text-sm">{r.name}</p>
              <p className="text-xs text-muted mt-1">{r.cost} points</p>
              <Button size="sm" className="w-full mt-3" disabled={user.points < r.cost} onClick={() => showToast('success', `${r.name} redeemed!`)}>
                {user.points >= r.cost ? 'Redeem' : 'Not enough points'}
              </Button>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Ways to earn */}
      <h2 className="font-display font-bold text-xl mb-4">Ways to Earn</h2>
      <div className="grid md:grid-cols-3 gap-3 mb-8">
        {[{ icon: TrendingUp, label: 'Shop', desc: '1 point per $1 spent', pts: '1x' }, { icon: Star, label: 'Review', desc: '50 points per review', pts: '50 pts' }, { icon: Users, label: 'Refer', desc: '200 points per referral', pts: '200 pts' }].map(e => (
          <div key={e.label} className="card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center"><e.icon className="w-5 h-5" /></div>
            <div className="flex-1"><p className="font-medium text-sm">{e.label}</p><p className="text-xs text-muted">{e.desc}</p></div>
            <Badge variant="gold">{e.pts}</Badge>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <h2 className="font-display font-bold text-xl mb-4">Points History</h2>
      <div className="card p-2">
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border-b border-base last:border-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'earned' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {t.type === 'earned' ? <TrendingUp className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
            </div>
            <div className="flex-1"><p className="text-sm font-medium">{t.desc}</p><p className="text-xs text-muted">{formatDate(t.date)}</p></div>
            <span className={`font-medium text-sm ${t.type === 'earned' ? 'text-emerald-400' : 'text-red-400'}`}>{t.amount > 0 ? '+' : ''}{t.amount} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
