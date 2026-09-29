import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Image, Ruler } from 'lucide-react';
import { ArchitecturalRender, BlueprintSchematic } from './ArchitecturalRender';
import type { PropertyInput } from '../types';

type Mode = 'render' | 'photo' | 'blueprint';

const modes: { id: Mode; label: string; icon: typeof Box }[] = [
  { id: 'render', label: '3D Render', icon: Box },
  { id: 'photo', label: 'Listing Photo', icon: Image },
  { id: 'blueprint', label: 'CAD Blueprint', icon: Ruler },
];

interface Props {
  property: PropertyInput;
  className?: string;
}

export function ArchitecturalImagePreview({ property, className }: Props) {
  const [mode, setMode] = useState<Mode>('render');
  const [imgError, setImgError] = useState(false);

  return (
    <div className={className}>
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
        <AnimatePresence mode="wait">
          {mode === 'render' && (
            <motion.div
              key="render"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <ArchitecturalRender archetype={property.archetype} className="w-full h-full" />
            </motion.div>
          )}
          {mode === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {property.imageUrl && !imgError ? (
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Image className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">No listing photo available</p>
                </div>
              )}
            </motion.div>
          )}
          {mode === 'blueprint' && (
            <motion.div
              key="blueprint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <BlueprintSchematic property={property} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode switcher */}
        <div className="absolute bottom-3 left-3 flex gap-1 bg-slate-900/85 backdrop-blur rounded-lg p-1">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  mode === m.id ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
