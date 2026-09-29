'use client';

import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { useState } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar onCmdOpen={() => setCmdOpen(true)} />
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
