import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { ModuleDrawer } from '@/components/ModuleDrawer';
import type { Module } from '@/types';
import { AlertTriangle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function DependenciesPage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showOnlyCircular, setShowOnlyCircular] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const circularCount = repo.circularDeps.length;
  const modules = repo.modules;

  // Build dep tree nodes
  const circularModuleNames = new Set(repo.circularDeps.flatMap((cd) => cd.chain));

  return (
    <div className="flex flex-col h-[calc(100vh-52px)]">
      {/* Warning banner */}
      {circularCount > 0 && (
        <div className="bg-b-yellow-bg border-b-[0.5px] border-b-yellow px-5 py-2.5 flex items-center gap-2 shrink-0">
          <AlertTriangle size={14} className="text-b-yellow" />
          <span className="font-mono text-[13px] text-b-yellow">
            ⚠ {circularCount} dependências circulares detectadas
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="h-[44px] bg-b-surface border-b-[0.5px] border-b-border flex items-center px-4 gap-2 shrink-0">
        <span className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.1em]">DEPENDENCY GRAPH</span>
        <div className="flex-1" />
        <div className="flex border-[0.5px] border-b-border-subtle rounded-btn overflow-hidden">
          <button
            onClick={() => setShowOnlyCircular(false)}
            className={`font-mono text-[11px] px-3 py-1 transition-colors duration-150 ${!showOnlyCircular ? 'bg-b-blue-bg text-b-blue' : 'text-b-text-muted'}`}
          >
            Mostrar todos
          </button>
          <button
            onClick={() => setShowOnlyCircular(true)}
            className={`font-mono text-[11px] px-3 py-1 transition-colors duration-150 ${showOnlyCircular ? 'bg-b-blue-bg text-b-blue' : 'text-b-text-muted'}`}
          >
            Apenas circulares
          </button>
        </div>
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150 ml-2">
          <ZoomIn size={16} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
          <ZoomOut size={16} />
        </button>
        <button onClick={() => setZoom(1)} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Graph area */}
      <div className="flex-1 bg-b-base overflow-auto p-6">
        {/* Circular dep chains */}
        {showOnlyCircular ? (
          <div className="space-y-3 max-w-[600px] mx-auto">
            {repo.circularDeps.map((cd) => (
              <div key={cd.id} className="bg-b-card border-[0.5px] border-b-border rounded-card p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {cd.chain.map((name, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className={`font-mono text-[12px] px-2 py-1 rounded-sm border-[0.5px] ${
                        i === cd.chain.length - 1
                          ? 'bg-b-red-bg border-b-red-border text-b-red'
                          : 'bg-b-yellow-bg border-b-yellow-border text-b-yellow'
                      }`}>
                        {name}
                      </span>
                      {i < cd.chain.length - 1 && <span className="text-b-text-ghost">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-[700px] mx-auto">
            {modules.map((mod) => {
              const isCircular = circularModuleNames.has(mod.name);
              const deps = mod.dependsOn
                .map((id) => modules.find((m) => m.id === id))
                .filter(Boolean);
              return (
                <div
                  key={mod.id}
                  className="bg-b-card border-[0.5px] border-b-border rounded-card p-4 cursor-pointer hover:border-b-blue transition-colors duration-150"
                  onClick={() => setSelectedModule(mod)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isCircular ? 'bg-b-red' : 'bg-b-green'}`} />
                    <span className="font-mono text-[13px] text-white">{mod.name}</span>
                    {isCircular && (
                      <span className="font-mono text-[10px] text-b-red bg-b-red-bg border-[0.5px] border-b-red-border px-1.5 py-0.5 rounded-sm">circular</span>
                    )}
                  </div>
                  {deps.length > 0 && (
                    <div className="mt-2 ml-4 flex flex-wrap gap-1.5">
                      {deps.map((d) => (
                        <span key={d!.id} className="font-mono text-[11px] text-b-text-muted">
                          → {d!.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ModuleDrawer module={selectedModule} onClose={() => setSelectedModule(null)} allModules={modules} />
    </div>
  );
}
