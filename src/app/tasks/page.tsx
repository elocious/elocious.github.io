'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, Plus, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui/PageParts';

const CATEGORIES = ['financial', 'taxes', 'hoa', 'insurance', 'utilities', 'maintenance', 'structural', 'roof', 'foundation', 'plumbing', 'electrical', 'hvac', 'drainage', 'legal', 'ownership', 'restrictions', 'permits', 'disclosures', 'lease', 'neighborhood', 'noise', 'traffic', 'flooding', 'construction', 'services'];
const STATUSES = ['not_started', 'in_progress', 'complete', 'needs_attention'];
const STATUS_ICONS: Record<string, any> = {
  not_started: Clock,
  in_progress: Clock,
  complete: Check,
  needs_attention: AlertCircle,
};
const STATUS_COLORS: Record<string, string> = {
  not_started: 'text-slate-400 bg-slate-100 dark:bg-slate-800',
  in_progress: 'text-gold-600 bg-gold-50 dark:bg-gold-950/30 dark:text-gold-400',
  complete: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
  needs_attention: 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'financial', propertyId: '' });
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/tasks').then(r => r.json()),
      fetch('/api/properties?limit=50').then(r => r.json()),
    ]).then(([t, p]) => {
      setTasks(t.tasks || []);
      setProperties(p.properties || []);
      setLoading(false);
    });
  }, []);

  const add = async () => {
    if (!newTask.title) return;
    const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask) });
    const data = await res.json();
    setTasks([data.task, ...tasks]);
    setNewTask({ title: '', category: 'financial', propertyId: '' });
    setShowAdd(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const remove = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = tasks.filter(t => t.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, any[]>);

  const pending = tasks.filter(t => t.status !== 'complete').length;
  const complete = tasks.filter(t => t.status === 'complete').length;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Due Diligence Tasks"
        subtitle={`${pending} pending · ${complete} complete`}
        icon={CheckSquare}
        action={
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition min-h-[44px]">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        }
      />

      {showAdd && (
        <div className="premium-card p-5 mb-6 animate-slide-up space-y-3">
          <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task title (e.g., Order home inspection)" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})} className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm capitalize">
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
            <select value={newTask.propertyId} onChange={e => setNewTask({...newTask, propertyId: e.target.value})} className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
              <option value="">No property</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <button onClick={add} disabled={!newTask.title} className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition">Add Task</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}</div>
      ) : tasks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize mb-2">{cat} · {items.length}</h3>
              <div className="space-y-2">
                {items.map(t => {
                  const Icon = STATUS_ICONS[t.status];
                  return (
                    <div key={t.id} className="premium-card p-3 flex items-center gap-3">
                      <button onClick={() => updateStatus(t.id, t.status === 'complete' ? 'not_started' : 'complete')} className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition ${STATUS_COLORS[t.status]}`}>
                        <Icon className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${t.status === 'complete' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{t.title}</p>
                        {t.property && <p className="text-xs text-slate-400">{t.property.title}</p>}
                      </div>
                      <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 capitalize border-0 cursor-pointer">
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                      </select>
                      <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create due diligence tasks to track your property research — inspections, document reviews, financial checks, and more."
        />
      )}
    </div>
  );
}
