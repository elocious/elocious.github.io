'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from '@/components/PropertyCard';
import { PageHeader, EmptyState } from '@/components/ui/PageParts';
import Link from 'next/link';

export default function SavedPage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/saved').then(r => r.json()).then(d => {
      setSaved(d.saved || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-8xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="Saved Properties" subtitle={`${saved.length} ${saved.length === 1 ? 'property' : 'properties'} saved`} icon={Heart} />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : saved.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(s => <PropertyCard key={s.id} property={{ ...s.property, saved: true }} />)}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved properties yet"
          description="Save properties you're interested in to track them in your vault and get AI insights."
          action={<Link href="/discover" className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">Discover Properties</Link>}
        />
      )}
    </div>
  );
}
