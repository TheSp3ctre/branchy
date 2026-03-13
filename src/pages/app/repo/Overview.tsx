import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { ModuleDrawer } from '@/components/ModuleDrawer';
import { getModuleColor, getScoreColor, getSeverityColor } from '@/lib/branchy-utils';
import type { Module } from '@/types';

export default function RepoOverview() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const issueCount = repo.healthReport.issues.filter(i => !i.resolved).length;

  const metrics = [
    { value: repo.filesCount, label: 'arquivos mapeados', color: 'text-white' },
    { value: `${repo.healthReport.testCoverage}%`, label: 'cobertura', color: getScoreColor(repo.healthReport.testCoverage) },
    { value: issueCount, label: 'problemas', color: issueCount > 0 ? 'text-b-yellow' : 'text-white' },
    { value: repo.circularDeps.length, label: 'deps circulares', color: repo.circularDeps.length > 0 ? 'text-b-red' : 'text-white' },
  ];

  return (
    <div className="p-6">
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="bg-b-card border-[0.5px] border-b-border rounded-card px-5 py-4">
            <div className={`font-mono text-[28px] font-semibold ${m.color}`}>{m.value}</div>
            <div className="font-body text-[12px] text-b-text-muted mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Module graph panel */}
      <div className="mt-4 bg-b-card border-[0.5px] border-b-border rounded-card p-5">
        <h2 className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.1em]">GRAFO DE MÓDULOS</h2>
        <div className="flex flex-wrap gap-2 mt-3.5">
          {repo.modules.map((mod) => {
            const colors = getModuleColor(mod.type);
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`font-mono text-[11px] px-3 py-1.5 rounded-sm border-[0.5px] cursor-pointer transition-opacity duration-150 hover:opacity-80 ${colors.bg} ${colors.border} ${colors.text}`}
              >
                {mod.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Complexity by file */}
        <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-5">
          <h2 className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.1em] mb-4">COMPLEXIDADE POR ARQUIVO</h2>
          <div className="space-y-3">
            {repo.complexityByFile.map((f) => (
              <div key={f.fileName} className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-b-text w-28 truncate">{f.fileName}</span>
                <div className="flex-1 h-[5px] bg-b-border rounded-sm overflow-hidden">
                  <div
                    className={`h-full rounded-sm ${
                      f.level === 'high' ? 'bg-b-red' : f.level === 'medium' ? 'bg-b-yellow' : 'bg-b-green'
                    }`}
                    style={{ width: `${f.complexity}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-b-text-muted w-8 text-right">{f.complexity}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-5">
          <h2 className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.1em] mb-4">INSIGHTS DA IA</h2>
          <div className="space-y-0">
            {repo.insights.map((insight, i) => {
              const dotColor = insight.type === 'warning' ? 'bg-b-yellow' : insight.type === 'error' ? 'bg-b-red' : insight.type === 'success' ? 'bg-b-green' : 'bg-b-blue';
              return (
                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b-[0.5px] border-b-border last:border-0">
                  <span className={`w-3.5 h-3.5 rounded-sm shrink-0 mt-0.5 ${dotColor}`} />
                  <p className="font-body text-[13px] text-b-text-secondary">
                    {insight.text}{' '}
                    {insight.fileName && <span className="text-b-text font-medium">{insight.fileName}</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModuleDrawer module={selectedModule} onClose={() => setSelectedModule(null)} allModules={repo.modules} />
    </div>
  );
}
