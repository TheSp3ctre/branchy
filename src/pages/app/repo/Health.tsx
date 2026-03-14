import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { getScoreColor, getSeverityColor } from '@/lib/branchy-utils';
import { ChevronDown, ChevronUp, Shield, Activity, Box, Zap, FileText, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { codeHealthService, CodeHealthIssue, CodeHealthRun } from '@/services/codeHealth';

type IssueFilter = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'info';

export default function HealthPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  
  const [issues, setIssues] = useState<CodeHealthIssue[]>([]);
  const [lastRun, setLastRun] = useState<CodeHealthRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<IssueFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      const runData = await codeHealthService.getLatestRun(repoId);
      setLastRun(runData);
      if (runData) {
        const issuesData = await codeHealthService.getIssues(runData.id);
        setIssues(issuesData);
      }
    } catch (err) {
      console.error('Failed to fetch health data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [repoId]);

  const filteredIssues = useMemo(() => {
    return issues.filter((i) => (filter === 'all' || i.severity === filter));
  }, [issues, filter]);

  const dimensions = useMemo(() => {
    if (!lastRun) return [];
    return [
      { label: 'Segurança', value: lastRun.scoreSecurity, icon: Shield },
      { label: 'Arquitetura', value: lastRun.scoreArch, icon: Box },
      { label: 'Manutenibilidade', value: lastRun.scoreMaintain, icon: Activity },
      { label: 'Testes', value: lastRun.scoreTests, icon: Zap, suffix: '%' },
      { label: 'Docs', value: lastRun.scoreDocs, icon: FileText, suffix: '%' },
    ];
  }, [lastRun]);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      {/* Score hero */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-mono text-[84px] font-bold leading-none ${getScoreColor(Number(lastRun?.scoreOverall || 0))}`}
          >
            {lastRun?.scoreOverall ? Number(lastRun.scoreOverall).toFixed(0) : '--'}
          </motion.span>
          <span className="font-mono text-[24px] text-b-text-ghost absolute -right-12 bottom-4">/ 100</span>
        </div>
        <div className="font-mono text-[11px] text-b-text-ghost uppercase tracking-[0.2em] mt-2">CODE HEALTH SCORE</div>
        
        {lastRun?.deltaScore && (
          <div className={`mt-3 flex items-center gap-1.5 font-mono text-[13px] px-3 py-1 rounded-full border-[0.5px] ${
            Number(lastRun.deltaScore) >= 0 ? 'bg-b-green-bg border-b-green/30 text-b-green' : 'bg-b-red-bg border-b-red/30 text-b-red'
          }`}>
            {Number(lastRun.deltaScore) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Number(lastRun.deltaScore) >= 0 ? `+${lastRun.deltaScore}` : lastRun.deltaScore} desde a última run
          </div>
        )}
      </div>

      {/* AI Executive Summary */}
      {lastRun?.aiSummary && (
        <div className="bg-b-card border-[0.5px] border-b-blue/30 rounded-card p-6 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={40} className="text-b-blue" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-b-blue" />
            <span className="font-mono text-[11px] text-b-blue uppercase tracking-wider font-bold">Resumo Executivo (IA)</span>
          </div>
          <p className="font-body text-[15px] text-white leading-relaxed">
            {lastRun.aiSummary}
          </p>
        </div>
      )}

      {/* Dimension grid */}
      <div className="grid grid-cols-5 gap-3 mb-10">
        {dimensions.map((dim) => (
          <div key={dim.label} className="bg-b-card border-[0.5px] border-b-border rounded-card p-4 hover:border-b-blue/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <dim.icon size={14} className="text-b-text-ghost" />
              <span className={`font-mono text-[18px] font-bold ${getScoreColor(Number(dim.value || 0))}`}>
                {dim.value !== null ? Number(dim.value).toFixed(0) : '--'}{dim.suffix || ''}
              </span>
            </div>
            <div className="font-mono text-[10px] text-b-text-ghost uppercase tracking-wider">{dim.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-[12px] text-b-text-ghost uppercase tracking-wider">Issues Consolidadas ({issues.length})</h3>
        <div className="flex gap-1.5">
          {(['all', 'critical', 'high', 'medium'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`font-mono text-[10px] px-3 py-1 rounded-full border-[0.5px] uppercase transition-all ${
                filter === v
                  ? 'bg-white text-black border-white'
                  : 'border-b-border text-b-text-muted hover:border-b-text-ghost'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Issues list */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-b-card animate-pulse rounded-card border-[0.5px] border-b-border" />)}
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-12 border-[0.5px] border-dashed border-b-border rounded-card">
          <p className="font-mono text-[13px] text-b-text-ghost">Nenhuma issue encontrada para este filtro.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-b-card border-[0.5px] border-b-border rounded-card overflow-hidden group">
              <button
                onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-b-surface transition-colors"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${getSeverityColor(issue.severity)}`} />
                <span className="font-mono text-[11px] text-b-text-ghost uppercase tracking-wider px-2 py-0.5 bg-b-elevated rounded-sm">
                  {issue.dimension}
                </span>
                <span className="font-body text-[13px] text-white flex-1 group-hover:translate-x-1 transition-transform">{issue.message}</span>
                {expandedId === issue.id ? <ChevronUp size={14} className="text-b-text-ghost" /> : <ChevronDown size={14} className="text-b-text-ghost" />}
              </button>
              <AnimatePresence>
                {expandedId === issue.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-b-surface/50"
                  >
                    <div className="px-5 pb-6 pt-2 border-t-[0.5px] border-b-border">
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-wider block mb-2">Impacto (IA)</span>
                          <p className="font-body text-[13px] text-b-text-secondary leading-relaxed">
                            {issue.aiExplanation || 'A IA não forneceu uma explicação para esta issue.'}
                          </p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-b-green uppercase tracking-wider block mb-2 font-bold">Sugestão de Fix</span>
                          <div className="bg-b-card border-[0.5px] border-b-green/20 p-3 rounded-card">
                            <p className="font-mono text-[12px] text-b-text whitespace-pre-wrap">
                              {issue.aiFix || 'Não há sugestão de correção automática.'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <button className="font-mono text-[11px] text-b-blue border-[0.5px] border-b-blue/30 rounded-btn px-4 py-2 hover:bg-b-blue-bg transition-colors">
                          Explorar esta área →
                        </button>
                        <button className="font-mono text-[11px] text-b-text-ghost border-[0.5px] border-b-border rounded-btn px-4 py-2 hover:bg-b-elevated transition-colors">
                          Ignorar issue
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
