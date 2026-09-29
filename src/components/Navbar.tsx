import { Home, Vault, Plus, GitCompare, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../lib/store';
import type { ViewMode } from '../types';

const tabs: { id: ViewMode; label: string; icon: typeof Home }[] = [
  { id: 'vault', label: 'Vault', icon: Vault },
  { id: 'evaluate', label: 'Evaluate', icon: Plus },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Navbar({ onOpenAdvisor }: { onOpenAdvisor: () => void }) {
  const { state, dispatch } = useStore();

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'vault' })}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white hidden sm:block">BetterHome</span>
          </button>

          {/* Desktop tabs */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = state.view === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => dispatch({ type: 'SET_VIEW', view: tab.id })}
                  className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {tab.label}
                  {tab.id === 'compare' && state.comparisonIds.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] font-bold">
                      {state.comparisonIds.length}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-slate-800 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Advisor button */}
          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = state.view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_VIEW', view: tab.id })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === 'compare' && state.comparisonIds.length > 0 && (
                  <span className="px-1.5 rounded-full bg-cyan-500 text-white text-[10px]">{state.comparisonIds.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
