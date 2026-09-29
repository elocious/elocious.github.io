'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, BellOff } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui/PageParts';

export default function AlertsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(d => {
      setNotifications(d.notifications || []);
      setLoading(false);
    });
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' });
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Alert Center"
        subtitle={`${notifications.filter(n => !n.read).length} unread`}
        icon={Bell}
        action={notifications.some(n => !n.read) ? (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        ) : undefined}
      />
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`premium-card p-4 flex items-start gap-3 ${!n.read ? 'border-brand-300 dark:border-brand-700' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-brand-50 dark:bg-brand-950/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <Bell className={`w-4 h-4 ${!n.read ? 'text-brand-500' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={BellOff} title="No notifications" description="You're all caught up! New property matches, price changes, and task reminders will appear here." />
      )}
    </div>
  );
}
