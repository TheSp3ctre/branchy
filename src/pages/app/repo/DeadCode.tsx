import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { deadcodeService, DeadcodeIssue, DeadcodeRun } from '@/services/deadcode';
import { n8nService } from '@/services/n8n';
import { AlertTriangle, Play, Filter, CheckCircle2, FlaskConical, Search, RefreshCw, ShieldAlert } from 'lucide-react';

export default function DeadCodePage() {
  const { repoId } = useParams<{ repoId: string }>();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  
  const [issues, setIssues] = useState<DeadcodeIssue[]>([]);
  const [lastRun, setLastRun] = useState<DeadcodeRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const fetchData = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      const [runData, issuesData] = await Promise.all([
        deadcodeService.getLatestRun(repoId),
        deadcodeService.getIssues(repoId)
      ]);
      setLastRun(runData);
      setIssues(issuesData);
    } catch (err) {
      console.error('Failed to fetch deadcode data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!repoId) return;
    try {
      setAnalyzing(true);
      await n8nService.analyzeDeadcode(repoId);
      await fetchData();
    } catch (err) {
      console.error('Analysis trigger failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [repoId]);

  const filteredIssues = useMemo(() => {
    if (filter === 'all') return issues;
    return issues.filter(i => i.type === filter);
  }, [issues, filter]);

  const stats = useMemo(() => {
    return {
      total: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      deadCode: issues.filter(i => i.type === 'dead-code').length,
      complexity: issues.filter(i => i.type === 'complexity').length,
    };
  }, [issues]);

  const getSeverityStyle = (severity: string) => {
    const styles: Record<string, string> = {
      critical: 'bg-b-red-bg border-b-red-border text-b-red',
      high: 'bg-b-red-bg/50 border-b-red-border/50 text-b-red',
      medium: 'bg-b-yellow-bg border-b-yellow-border text-b-yellow',
      low: 'bg-b-blue-bg border-b-blue-border text-b-blue',
      info: 'bg-b-card border-b-border-subtle text-b-text-ghost',
    };
    return styles[severity] || styles.info;
  };

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  return (
    <div className="p-6">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-mono text-[18px] text-white flex items-center gap-2">
            Análise Estática & QA <span className="text-[10px] bg-b-blue-bg text-b-blue px-1.5 py-0.5 rounded-sm">BETA</span>
          </h2>
          <p className="font-body text-[13px] text-b-text-ghost mt-1">
            {lastRun 
              ? `Última varredura: ${new Date(lastRun.startedAt).toLocaleString()}` 
              : 'Nenhuma varredura realizada ainda.'}
          </p>
        </div>
        
        <button 
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 font-mono text-[12px] bg-b-blue text-white rounded-btn px-4 py-2 hover:brightness-110 transition-all disabled:opacity-50"
        >
          {analyzing ? (
            <><RefreshCw size={14} className="animate-spin" /> Analisando...</>
          ) : (
            <><Play size={14} /> Iniciar Análise</>
          )}
        </button>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-b-card border-[0.5px] border-b-border rounded-card p-4">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-wider block mb-1">Módulos Mortos</span>
          <span className="font-mono text-[24px] text-b-red">{stats.deadCode}</span>
        </div>
        <div className="flex-1 bg-b-card border-[0.5px] border-b-border rounded-card p-4">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-wider block mb-1">Críticos</span>
          <span className="font-mono text-[24px] text-b-red">{stats.critical}</span>
        </div>
        <div className="flex-1 bg-b-card border-[0.5px] border-b-border rounded-card p-4">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-wider block mb-1">Complexidade Alta</span>
          <span className="font-mono text-[24px] text-b-yellow">{stats.complexity}</span>
        </div>
        <div className="flex-1 bg-b-card border-[0.5px] border-b-border rounded-card p-4">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-wider block mb-1">Files Scanned</span>
          <span className="font-mono text-[24px] text-b-blue">{lastRun?.filesScanned || 0}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-4">
        {['all', 'dead-code', 'vulnerability', 'complexity', 'duplication'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`font-mono text-[11px] px-3 py-1 rounded-full border-[0.5px] transition-colors ${
              filter === t ? 'bg-white text-black border-white' : 'text-b-text-muted border-b-border hover:border-b-text-ghost'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && !analyzing ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-b-card animate-pulse rounded-card border-[0.5px] border-b-border" />)}
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-20 border-[0.5px] border-dashed border-b-border rounded-card">
          <CheckCircle2 size={40} className="text-b-green mx-auto mb-4 opacity-20" />
          <p className="font-mono text-[14px] text-b-text-ghost">Nenhum problema detectado. Código limpo!</p>
        </div>
      ) : (
        /* Issue list */
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-b-card border-[0.5px] border-b-border rounded-card p-5 hover:border-b-blue/50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    issue.severity === 'critical' ? 'bg-b-red/10 text-b-red' : 'bg-b-blue/10 text-b-blue'
                  }`}>
                    {issue.type === 'vulnerability' ? <ShieldAlert size={16} /> : <FlaskConical size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[14px] text-white underline underline-offset-4 decoration-b-border group-hover:decoration-b-blue">
                        {issue.symbol || issue.filePath.split('/').pop()}
                      </span>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border-[0.5px] uppercase font-bold ${getSeverityStyle(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-b-text-ghost mt-1">
                      {issue.filePath}{issue.lineStart ? `:L${issue.lineStart}` : ''}
                    </p>
                  </div>
                </div>
                <button className="text-b-text-ghost hover:text-white transition-colors">
                  <Search size={16} />
                </button>
              </div>

              <p className="font-body text-[13px] text-b-text-secondary mt-3">
                {issue.message}
              </p>

              {issue.fixSuggestion && (
                <div className="mt-4 bg-b-surface border-l-2 border-b-green p-3 rounded-r-card">
                  <span className="font-mono text-[10px] text-b-green uppercase tracking-wider font-bold block mb-1">IA Fix Suggestion</span>
                  <p className="font-body text-[12px] text-b-text-muted italic">
                    {issue.fixSuggestion}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <button className="font-mono text-[11px] text-b-green hover:underline">Ver no arquivo →</button>
                <button className="font-mono text-[11px] text-b-text-muted hover:text-white transition-colors">Ignorar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
