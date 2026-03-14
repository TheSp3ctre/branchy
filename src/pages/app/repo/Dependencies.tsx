import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { ModuleDrawer } from '@/components/ModuleDrawer';
import type { Module } from '@/types';
import { AlertTriangle, ZoomIn, ZoomOut, RotateCcw, ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';
import { dependencyService, DependencyIssue, DependencyScan } from '@/services/dependencies';
import { n8nService } from '@/services/n8n';

export default function DependenciesPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showOnlyCircular, setShowOnlyCircular] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const [issues, setIssues] = useState<DependencyIssue[]>([]);
  const [lastScan, setLastScan] = useState<DependencyScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchData = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      const [scanData, issuesData] = await Promise.all([
        dependencyService.getLatestScan(repoId),
        dependencyService.getIssues(repoId)
      ]);
      setLastScan(scanData);
      setIssues(issuesData);
    } catch (err) {
      console.error('Failed to fetch dependency data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartScan = async () => {
    if (!repoId) return;
    try {
      setScanning(true);
      await n8nService.scanDeps(repoId);
      await fetchData();
    } catch (err) {
      console.error('Scan trigger failed:', err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [repoId]);

  const { circularModuleNames, moduleMap, circularCount, modules, issueMap } = useMemo(() => {
    const cMap = new Map<string, DependencyIssue[]>();
    issues.forEach(issue => {
      const existing = cMap.get(issue.packageName) || [];
      cMap.set(issue.packageName, [...existing, issue]);
    });

    if (!repo) return { circularModuleNames: new Set<string>(), moduleMap: new Map<string, Module>(), circularCount: 0, modules: [], issueMap: cMap };
    
    const circularNames = new Set(repo.circularDeps.flatMap((cd) => cd.chain));
    const map = new Map<string, Module>();
    repo.modules.forEach(m => map.set(m.id, m));
    
    return { 
      circularModuleNames: circularNames, 
      moduleMap: map,
      circularCount: repo.circularDeps.length,
      modules: repo.modules,
      issueMap: cMap
    };
  }, [repo, issues]);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-52px)]">
      {/* Status Bar */}
      <div className="bg-b-surface border-b-[0.5px] border-b-border px-5 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.1em]">Saúde do Grafo:</span>
            {lastScan?.vulnerabilities === 0 ? (
              <span className="flex items-center gap-1.5 font-mono text-[12px] text-b-green">
                <ShieldCheck size={14} /> Seguro
              </span>
            ) : lastScan ? (
              <span className="flex items-center gap-1.5 font-mono text-[12px] text-b-red">
                <ShieldAlert size={14} /> {lastScan.vulnerabilities} Vulnerabilidades
              </span>
            ) : (
              <span className="font-mono text-[12px] text-b-text-muted italic">Nenhum scan realizado</span>
            )}
          </div>
          
          {circularCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-b-yellow" />
              <span className="font-mono text-[12px] text-b-yellow">
                {circularCount} Circulares
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={handleStartScan}
          disabled={scanning}
          className="flex items-center gap-2 font-mono text-[11px] text-b-blue border-[0.5px] border-b-blue/30 rounded-btn px-3 py-1 hover:bg-b-blue-bg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={scanning ? 'animate-spin' : ''} />
          {scanning ? 'Escaneando...' : 'Escanear agora'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="h-[44px] bg-b-base border-b-[0.5px] border-b-border flex items-center px-4 gap-2 shrink-0">
        <div className="flex border-[0.5px] border-b-border-subtle rounded-btn overflow-hidden">
          <button
            onClick={() => setShowOnlyCircular(false)}
            className={`font-mono text-[11px] px-3 py-1 transition-colors duration-150 ${!showOnlyCircular ? 'bg-b-card text-b-text' : 'text-b-text-muted hover:bg-b-surface'}`}
          >
            Todos os módulos
          </button>
          <button
            onClick={() => setShowOnlyCircular(true)}
            className={`font-mono text-[11px] px-3 py-1 transition-colors duration-150 ${showOnlyCircular ? 'bg-b-card text-b-text' : 'text-b-text-muted hover:bg-b-surface'}`}
          >
            Apenas circulares
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150">
            <ZoomOut size={16} />
          </button>
          <button onClick={() => setZoom(1)} className="p-1.5 text-b-text-muted hover:text-b-text transition-colors duration-150 border-l-[0.5px] border-b-border ml-1 pl-2">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Graph area */}
      <div className="flex-1 bg-b-base overflow-auto p-6" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
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
              const modIssues = issueMap.get(mod.name) || [];
              const hasVulnerability = modIssues.some(i => i.category === 'vulnerability');
              const hasOutdated = modIssues.some(i => i.category === 'outdated');
              
              const deps = mod.dependsOn
                .map((id) => moduleMap.get(id))
                .filter(Boolean);
              return (
                <div
                  key={mod.id}
                  className={`bg-b-card border-[0.5px] rounded-card p-4 cursor-pointer transition-all duration-150 ${
                    hasVulnerability ? 'border-b-red/50 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:border-b-red' :
                    hasOutdated ? 'border-b-yellow/50 hover:border-b-yellow' :
                    'border-b-border hover:border-b-blue'
                  }`}
                  onClick={() => setSelectedModule(mod)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      hasVulnerability ? 'bg-b-red' : 
                      isCircular ? 'bg-b-yellow' : 
                      'bg-b-green'
                    }`} />
                    <span className="font-mono text-[13px] text-white underline-offset-4 decoration-b-text-ghost">{mod.name}</span>
                    <div className="flex gap-1 ml-auto">
                      {hasVulnerability && (
                        <span className="font-mono text-[9px] text-b-red bg-b-red-bg border-[0.5px] border-b-red-border px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">vuln</span>
                      )}
                      {hasOutdated && (
                        <span className="font-mono text-[9px] text-b-yellow bg-b-yellow-bg border-[0.5px] border-b-yellow-border px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">outdated</span>
                      )}
                      {isCircular && (
                        <span className="font-mono text-[9px] text-b-text-ghost bg-b-elevated px-1.5 py-0.5 rounded-sm uppercase tracking-wider">circular</span>
                      )}
                    </div>
                  </div>
                  {deps.length > 0 && (
                    <div className="mt-2 ml-4 flex flex-wrap gap-1.5">
                      {deps.map((d) => (
                        <span key={d!.id} className="font-mono text-[11px] text-b-text-muted hover:text-b-text-secondary transition-colors">
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
