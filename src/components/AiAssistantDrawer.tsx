import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { marked } from 'marked';
import { Sparkles, Send, X, MessageCircle } from 'lucide-react';
import { useStore } from '../lib/store';
import { fetchAdvisorResponse } from '../lib/api';
import type { ChatMessage } from '../types';

const suggestedPrompts = [
  'Should I buy or rent?',
  'What are the hidden carrying costs?',
  'Explain the flood risk implications',
  'Which property has the best value?',
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AiAssistantDrawer({ open, onClose }: Props) {
  const { state } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetchAdvisorResponse(text, state.properties);
      setMessages(m => [...m, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I could not process your request. Please try again.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-slate-900 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white">AI Advisor</h2>
                  <p className="text-xs text-slate-400">Grounded in your vault</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-7 h-7 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Ask me anything about your properties</p>
                  <div className="flex flex-col gap-2">
                    {suggestedPrompts.map(p => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors text-left"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="markdown" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }} />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  placeholder="Ask about your properties..."
                  className="flex-1 rounded-xl bg-slate-800 text-white text-sm px-4 py-2.5 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white disabled:opacity-30 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
