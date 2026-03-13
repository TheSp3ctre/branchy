import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Module } from '@/types';
import { getModuleColor } from '@/lib/branchy-utils';

interface ModuleDrawerProps {
  module: Module | null;
  onClose: () => void;
  allModules: Module[];
}

export function ModuleDrawer({ module, onClose, allModules }: ModuleDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!module) return null;

  const colors = getModuleColor(module.type);
  const dependsOnNames = module.dependsOn.map(id => allModules.find(m => m.id === id)?.name || id);
  const usedByNames = module.usedBy.map(id => allModules.find(m => m.id === id)?.name || id);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <motion.div
          className="absolute right-0 top-[52px] h-[calc(100vh-52px)] w-[320px] bg-b-surface border-l-[0.5px] border-b-border overflow-y-auto p-5"
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-mono text-[16px] text-white">{module.name}</h3>
            <button onClick={onClose} className="text-b-text-muted hover:text-b-text transition-colors duration-150">
              <X size={16} />
            </button>
          </div>

          <span className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-sm border-[0.5px] ${colors.bg} ${colors.border} ${colors.text}`}>
            {module.type}
          </span>

          <div className="mt-5 space-y-5">
            <div>
              <h4 className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em] mb-2">DEPENDE DE</h4>
              {dependsOnNames.length > 0 ? (
                <div className="space-y-1">
                  {dependsOnNames.map((n) => (
                    <div key={n} className="font-mono text-[12px] text-b-text-secondary">{n}</div>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-[12px] text-b-text-ghost">// nenhuma</div>
              )}
            </div>

            <div>
              <h4 className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em] mb-2">USADO POR</h4>
              {usedByNames.length > 0 ? (
                <div className="space-y-1">
                  {usedByNames.map((n) => (
                    <div key={n} className="font-mono text-[12px] text-b-text-secondary">{n}</div>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-[12px] text-b-text-ghost">// nenhum</div>
              )}
            </div>

            <div>
              <h4 className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em] mb-2">LOC</h4>
              <span className="font-mono text-[14px] text-white">{module.loc}</span>
            </div>

            <div>
              <h4 className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em] mb-2">RESUMO</h4>
              <p className="font-body text-[14px] text-b-text-secondary leading-relaxed">{module.summary}</p>
            </div>

            <div>
              <h4 className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em] mb-2">CAMINHO</h4>
              <span className="font-mono text-[11px] text-b-text-muted">{module.filePath}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
