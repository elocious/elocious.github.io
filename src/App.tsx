import { useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { VaultView } from './components/VaultView';
import { ComparisonView } from './components/ComparisonView';
import { HouseEvaluationForm } from './components/HouseEvaluationForm';
import { DecisionProfileView } from './components/DecisionProfileView';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ArchitecturalRenderModal } from './components/ArchitecturalRenderModal';
import { ToastContainer, type ToastData } from './components/Toast';
import type { EvaluatedProperty } from './types';

function AppContent() {
  const { state, dispatch } = useStore();
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [dossierProperty, setDossierProperty] = useState<EvaluatedProperty | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(t => [...t, { id, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenAdvisor={() => setAdvisorOpen(true)} />

      <main>
        {state.view === 'vault' && <VaultView onOpenDossier={setDossierProperty} onToast={showToast} />}
        {state.view === 'evaluate' && (
          <HouseEvaluationForm onDone={() => dispatch({ type: 'SET_VIEW', view: 'vault' })} onToast={showToast} />
        )}
        {state.view === 'compare' && <ComparisonView onOpenDossier={setDossierProperty} />}
        {state.view === 'profile' && <DecisionProfileView onToast={showToast} />}
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-400">BetterHome — AI Real Estate Evaluation & Vault Platform</p>
        </div>
      </footer>

      <AiAssistantDrawer open={advisorOpen} onClose={() => setAdvisorOpen(false)} />

      {dossierProperty && (
        <ArchitecturalRenderModal property={dossierProperty} onClose={() => setDossierProperty(null)} />
      )}

      <ToastContainer toasts={toasts} onDismiss={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
