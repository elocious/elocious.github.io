'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Trash2, Users, Home, Plus, X } from 'lucide-react';
import { PageHeader, EmptyState, DataLabel } from '@/components/ui/PageParts';

const ROLES = [
  { id: 'buyer', label: 'Buyer', color: 'bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400' },
  { id: 'partner', label: 'Partner', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { id: 'family', label: 'Family', color: 'bg-gold-100 text-gold-700 dark:bg-gold-950/40 dark:text-gold-400' },
  { id: 'agent', label: 'Agent', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('You');
  const [authorRole, setAuthorRole] = useState('buyer');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterProperty, setFilterProperty] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/messages').then(r => r.json()),
      fetch('/api/properties?limit=50').then(r => r.json()),
    ]).then(([m, p]) => {
      setMessages(m.messages || []);
      setProperties(p.properties || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!content.trim()) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content.trim(),
        propertyId: selectedProperty || null,
        authorName,
        authorRole,
      }),
    });
    const data = await res.json();
    setMessages([...messages, data.message]);
    setContent('');
  };

  const remove = async (id: string) => {
    await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
    setMessages(messages.filter(m => m.id !== id));
  };

  const displayed = filterProperty
    ? messages.filter(m => m.propertyId === filterProperty)
    : messages;

  const propertyMap = properties.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<string, any>);

  const grouped = displayed.reduce((acc, m) => {
    const key = m.propertyId || 'general';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {} as Record<string, any[]>);

  const getRoleStyle = (role: string) => ROLES.find(r => r.id === role) || ROLES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Messages"
        subtitle={`${messages.length} messages · ${Object.keys(grouped).length} discussions`}
        icon={MessageSquare}
        action={
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]"
          >
            {showFilter ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showFilter ? 'Close' : 'Filter'}
          </button>
        }
      />

      {showFilter && (
        <div className="premium-card p-4 mb-4">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Filter by property</label>
          <select
            value={filterProperty}
            onChange={e => setFilterProperty(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm"
          >
            <option value="">All discussions</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : displayed.length > 0 ? (
        <div ref={scrollRef} className="space-y-6 mb-4 max-h-[50vh] overflow-y-auto">
          {Object.entries(grouped).map(([key, items]) => {
            const prop = key !== 'general' ? propertyMap[key] : null;
            return (
              <div key={key}>
                {prop ? (
                  <Link
                    href={`/property/${prop.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 hover:text-brand-500 transition"
                  >
                    <Home className="w-4 h-4" /> {prop.title}
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    <Users className="w-4 h-4" /> General Discussion
                  </div>
                )}
                <div className="space-y-2">
                  {items.map(m => {
                    const roleStyle = getRoleStyle(m.authorRole);
                    const isYou = m.authorRole === 'buyer' && m.authorName === 'You';
                    return (
                      <div key={m.id} className={`flex gap-3 ${isYou ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-semibold ${roleStyle.color}`}>
                          {m.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className={`flex-1 min-w-0 ${isYou ? 'text-right' : ''}`}>
                          <div className={`inline-block max-w-md px-4 py-2.5 rounded-2xl text-sm text-left ${
                            isYou
                              ? 'bg-brand-500 text-white rounded-tr-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-sm'
                          }`}>
                            {m.content}
                          </div>
                          <div className={`flex items-center gap-2 mt-1 ${isYou ? 'justify-end' : ''}`}>
                            <span className="text-xs font-medium text-slate-500">{m.authorName}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleStyle.color}`}>{getRoleStyle(m.authorRole).label}</span>
                            <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            <button
                              onClick={() => remove(m.id)}
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-300 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Start a discussion about a property with your partner, family, or agent. Share thoughts, ask questions, and make decisions together."
        />
      )}

      {/* Compose */}
      <div className="premium-card p-4 sticky bottom-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <input
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm"
            />
            <select
              value={authorRole}
              onChange={e => setAuthorRole(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm"
            >
              {ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <select
              value={selectedProperty}
              onChange={e => setSelectedProperty(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm flex-1 min-w-[150px]"
            >
              <option value="">General discussion</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Write a message..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm"
            />
            <button
              onClick={send}
              disabled={!content.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition min-h-[44px]"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
