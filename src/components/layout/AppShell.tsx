'use client';

import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { CommandPalette } from './CommandPalette';
import { useState } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCmdOpen={() => setCmdOpen(true)} />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
