'use client';

import Link from 'next/link';
import { Heart, Bed, Bath, Maximize, MapPin, Camera } from 'lucide-react';
import { useState } from 'react';
import { MatchBadge } from './ScoreRing';
import { formatCurrency } from '@/lib/calculations';

export interface PropertyCardData {
  id: string;
  title: string;
  price: number;
  rent?: number | null;
  listingType: string;
  propertyType: string;
  address: string;
  city: string;
  state?: string | null;
  neighborhood?: string | null;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string;
  matchPercentage?: number;
  saved?: boolean;
}

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const [saved, setSaved] = useState(property.saved || false);
  const [imgIndex, setImgIndex] = useState(0);
  const images: string[] = JSON.parse(property.images || '[]');

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    try {
      await fetch('/api/saved/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
    } catch {}
  };

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <div className="premium-card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {images.length > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[imgIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
          {/* Image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
          {/* Photo count */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur text-white text-xs">
            <Camera className="w-3 h-3" />
            {images.length}
          </div>
          {/* Save button */}
          <button
            onClick={toggleSave}
            className="absolute top-2 left-2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition"
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <Heart className={`w-4 h-4 transition ${saved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          {/* Match badge */}
          {property.matchPercentage != null && (
            <div className="absolute bottom-2 left-2">
              <MatchBadge percentage={property.matchPercentage} />
            </div>
          )}
          {/* Listing type */}
          <div className="absolute top-12 left-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${property.listingType === 'rent' ? 'bg-brand-500 text-white' : 'bg-slate-900/80 text-white backdrop-blur'}`}>
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {property.listingType === 'rent' ? `${formatCurrency(property.rent || 0)}/mo` : formatCurrency(property.price)}
            </span>
            <span className="text-xs text-slate-400 capitalize">{property.propertyType.replace('-', ' ')}</span>
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{property.title}</h3>
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}{property.state ? `, ${property.state}` : ''}</span>
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" /> {property.squareFeet.toLocaleString()} sqft
            </span>
          </div>

          {/* Price per sqft */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            {property.listingType === 'buy' && `${formatCurrency(property.price / property.squareFeet)}/sqft`}
            {property.listingType === 'rent' && `${formatCurrency((property.rent || 0) / property.squareFeet)}/sqft/mo`}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="premium-card overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-24 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
        <div className="flex gap-3 mt-3">
          <div className="h-3 w-12 skeleton" />
          <div className="h-3 w-12 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
      </div>
    </div>
  );
}
