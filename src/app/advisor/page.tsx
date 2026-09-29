'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { PageHeader, AIDisclaimer, DataLabel } from '@/components/ui/PageParts';

function AdvisorPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propertyId) {
      fetch(`/api/properties/${propertyId}`).then(r => r.json()).then(d => setProperty(d));
    }
  }, [propertyId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedQuestions = [
    'What are the biggest financial differences between these homes?',
    'What should I ask during the viewing?',
    'What information is missing?',
    'What potential maintenance issues should I investigate?',
    'Calculate the estimated monthly cost.',
    'What assumptions are being used?',
  ];

  const ask = async (question: string) => {
    if (!question.trim() || loading) return;
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, propertyId: propertyId || undefined }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 flex flex-col h-[calc(100vh-4rem)]">
      <PageHeader
        title="BetterHome AI Advisor"
        subtitle={property ? `Context: ${property.title}` : 'Ask me anything about properties, finances, or your search'}
        icon={Bot}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">How can I help you decide?</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              I understand your saved properties and profile. Ask me about financial differences, viewing questions, missing information, or maintenance concerns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
              {suggestedQuestions.map(q => (
                <button key={q} onClick={() => ask(q)} className="text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-600 transition">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-br from-brand-500 to-emerald-500'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              {msg.role === 'assistant' && <div className="mt-2"><DataLabel type="ai" /></div>}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask(input)}
            placeholder="Ask BetterHome AI..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 transition min-h-[48px]"
          />
          <button onClick={() => ask(input)} disabled={loading || !input.trim()} className="px-4 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition min-h-[48px] min-w-[48px] flex items-center justify-center">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <AIDisclaimer text="*AI responses distinguish verified data, estimates, and suggestions. Verify with professionals for financial, legal, and safety decisions.*" />
      </div>
    </div>
  );
}

export default function AdvisorPageWrapper() {
  return <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>}><AdvisorPage /></Suspense>;
}
