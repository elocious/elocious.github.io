'use client';

import { useEffect, useState } from 'react';
import { FileText, Upload, Search, Trash2, Sparkles } from 'lucide-react';
import { PageHeader, EmptyState, AIDisclaimer } from '@/components/ui/PageParts';

const CATEGORIES = ['listing', 'inspection', 'lease', 'purchase', 'hoa', 'disclosure', 'floorplan', 'appraisal', 'receipt', 'renovation'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', category: 'listing', propertyId: '' });
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/documents').then(r => r.json()),
      fetch('/api/properties?limit=50').then(r => r.json()),
    ]).then(([docs, props]) => {
      setDocuments(docs.documents || []);
      setProperties(props.properties || []);
      setLoading(false);
    });
  }, []);

  const upload = async () => {
    if (!newDoc.name) return;
    setUploading(true);
    const res = await fetch('/api/documents', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newDoc, fileUrl: null, fileSize: 0, fileType: 'document' }),
    });
    const data = await res.json();
    setDocuments([data.document, ...documents]);
    setNewDoc({ name: '', category: 'listing', propertyId: '' });
    setShowUpload(false);
    setUploading(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
    setDocuments(documents.filter(d => d.id !== id));
  };

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Document Vault"
        subtitle="Upload, organize, and analyze property documents with AI"
        icon={FileText}
        action={
          <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition min-h-[44px]">
            <Upload className="w-4 h-4" /> Upload
          </button>
        }
      />

      {/* Upload form */}
      {showUpload && (
        <div className="premium-card p-5 mb-6 animate-slide-up">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Upload Document</h3>
          <div className="space-y-3">
            <input value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} placeholder="Document name (e.g., Home Inspection Report)" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <select value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})} className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm capitalize">
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
              <select value={newDoc.propertyId} onChange={e => setNewDoc({...newDoc, propertyId: e.target.value})} className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
                <option value="">No property</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">File upload is simulated in demo mode. Enter a document name above to add it to your vault.</p>
            </div>
            <button onClick={upload} disabled={!newDoc.name || uploading} className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition min-h-[44px]">
              {uploading ? 'Uploading & analyzing...' : 'Add to Vault'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm" />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {/* Documents */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="premium-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">{d.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">{d.category}</span>
                  </div>
                  {d.property && <p className="text-xs text-slate-400 mt-0.5">{d.property.title}</p>}
                  {d.aiSummary && (
                    <div className="mt-2 p-3 rounded-xl bg-brand-50 dark:bg-brand-950/20">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400">AI Summary</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{d.aiSummary}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => remove(d.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload inspection reports, leases, purchase agreements, HOA documents, and more. AI will summarize and extract key information."
        />
      )}
      <AIDisclaimer text="*AI-generated summaries — always verify against the original document.*" />
    </div>
  );
}
