import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { getScoreColor, getSeverityColor } from '@/lib/branchy-utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type IssueFilter = 'all' | 'critical' | 'warning' | 'info';

export default function HealthPage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const resolveIssue = useBranchyStore((s) => s.resolveIssue);
  const [filter, setFilter] = useState<IssueFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const hr = repo.healthReport;
  const filters: { label: string; value: IssueFilter }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Crítico', value: 'critical' },
    { label: 'Avisos', value: 'warning' },
    { label: 'Info', value: 'info' },
  ];

  const filteredIssues = hr.issues.filter((i) => !i.resolved && (filter === 'all' || i.severity === filter));

  const categories = [
    { label: 'Manutenibilidade', value: hr.maintainability },
    { label: 'Cobertura de testes', value: hr.testCoverage, suffix: '%' },
    { label: 'Documentação', value: hr.documentation, suffix: '%' },
  ];

  return (
    <div className="p-6">
      {/* Score hero */}
      <div className="text-center mb-6">
        <span className={`font-mono text-[64px] font-semibold ${getScoreColor(hr.overallScore)}`}>
          {hr.overallScore}
        </span>
        <span className="font-mono text-[20px] text-b-text-muted ml-1">/ 100</span>
        <div className="font-body text-[13px] text-b-text-muted mt-1">score de saúde geral</div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div key={cat.label} className="bg-b-card border-[0.5px] border-b-border rounded-card p-5">
            <div className={`font-mono text-[28px] font-semibold ${getScoreColor(cat.value)}`}>
              {cat.value}{cat.suffix || ''}
            </div>
            <div className="font-body text-[12px] text-b-text-muted mt-1">{cat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 my-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`font-mono text-[11px] px-3 py-1.5 rounded-full border-[0.5px] transition-colors duration-150 ${
              filter === f.value
                ? 'bg-b-blue-bg border-b-blue text-b-blue'
                : 'border-b-border-subtle text-b-text-muted hover:text-b-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Issues list */}
      <div className="space-y-2">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="bg-b-card border-[0.5px] border-b-border rounded-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-b-surface transition-colors duration-150"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${getSeverityColor(issue.severity)}`} />
              <span className="font-mono text-[12px] text-b-text-muted shrink-0">{issue.fileName}</span>
              <span className="font-body text-[13px] text-b-text flex-1">{issue.title}</span>
              {expandedId === issue.id ? <ChevronUp size={14} className="text-b-text-muted" /> : <ChevronDown size={14} className="text-b-text-muted" />}
            </button>
            <AnimatePresence>
              {expandedId === issue.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 border-t-[0.5px] border-b-border pt-4">
                    <p className="font-body text-[14px] text-b-text-secondary leading-relaxed">{issue.description}</p>
                    <div className="mt-3 bg-b-surface border-l-2 border-b-green px-4 py-3 font-mono text-[12px] text-b-text">
                      {issue.suggestedFix}
                    </div>
                    <button
                      onClick={() => repoId && resolveIssue(repoId, issue.id)}
                      className="mt-3 font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 hover:bg-b-elevated transition-colors duration-150"
                    >
                      Marcar como resolvido
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
