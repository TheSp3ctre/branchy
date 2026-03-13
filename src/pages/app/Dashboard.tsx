import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { timeAgo, getScoreBg } from '@/lib/branchy-utils';

type Filter = 'all' | 'issues' | 'outdated';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { repos } = useBranchyStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const repoList = useMemo(() => {
    let list = Object.values(repos);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => `${r.owner}/${r.repoName}`.toLowerCase().includes(q));
    }
    if (filter === 'issues') list = list.filter((r) => r.healthReport.issues.filter(i => !i.resolved).length > 0);
    if (filter === 'outdated') list = list.filter((r) => Date.now() - new Date(r.analyzedAt).getTime() > 7 * 86400000);
    return list;
  }, [repos, search, filter]);

  const filters: { label: string; value: Filter }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Com problemas', value: 'issues' },
    { label: 'Desatualizados', value: 'outdated' },
  ];

  return (
    <div className="p-8 px-6 min-h-[calc(100vh-52px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-[20px] text-white">Repositórios</h1>
        <button
          onClick={() => navigate('/app/connect')}
          className="font-mono text-[13px] text-white bg-[#238636] hover:bg-[#2EA043] px-4 py-2 rounded-btn transition-colors duration-150"
        >
          + Conectar novo →
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex items-center gap-3 mt-5 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="buscar repositório..."
          className="w-[280px] bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3.5 py-2 font-mono text-[12px] text-b-text placeholder:text-b-text-ghost outline-none focus:border-b-blue transition-colors duration-150"
        />
        <div className="flex gap-1.5">
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
      </div>

      {/* Grid */}
      {repoList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-mono text-[14px] text-b-text-ghost">// nenhum repositório conectado</p>
          <button
            onClick={() => navigate('/app/connect')}
            className="mt-4 font-mono text-[13px] text-white bg-[#238636] hover:bg-[#2EA043] px-4 py-2 rounded-btn transition-colors duration-150"
          >
            Conectar primeiro repositório →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
          {repoList.map((repo) => {
            const issueCount = repo.healthReport.issues.filter(i => !i.resolved).length;
            return (
              <div
                key={repo.repoId}
                onClick={() => navigate(`/app/repo/${repo.repoId}`)}
                className="bg-b-card border-[0.5px] border-b-border rounded-card p-5 cursor-pointer hover:border-b-blue transition-colors duration-150"
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[14px] text-white">{repo.repoName}</span>
                  <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full border-[0.5px] ${getScoreBg(repo.healthScore)}`}>
                    {repo.healthScore}
                  </span>
                </div>

                {/* Second row */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] text-b-text-ghost">{repo.owner}/{repo.repoName}</span>
                  <span className="font-mono text-[10px] text-b-text-muted bg-b-elevated px-1.5 py-0.5 rounded-sm">{repo.language}</span>
                  <span className="font-body text-[11px] text-b-text-ghost ml-auto">{timeAgo(repo.analyzedAt)}</span>
                </div>

                {/* Metrics */}
                <div className="flex gap-4 mt-4">
                  <div>
                    <span className="font-mono text-[14px] text-white">{repo.filesCount}</span>
                    <span className="font-body text-[12px] text-b-text-secondary ml-1">arquivos</span>
                  </div>
                  <div>
                    <span className={`font-mono text-[14px] ${issueCount > 0 ? 'text-b-yellow' : 'text-white'}`}>{issueCount}</span>
                    <span className="font-body text-[12px] text-b-text-secondary ml-1">issues</span>
                  </div>
                  <div>
                    <span className={`font-mono text-[14px] ${repo.circularDeps.length > 0 ? 'text-b-red' : 'text-white'}`}>{repo.circularDeps.length}</span>
                    <span className="font-body text-[12px] text-b-text-secondary ml-1">circ. deps</span>
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-4 pt-3 border-t-[0.5px] border-b-border flex items-center justify-between">
                  <span className="font-mono text-[12px] text-b-green">Ver análise →</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="font-mono text-[11px] text-b-text-muted border-[0.5px] border-b-border-subtle rounded-btn px-2 py-1 hover:bg-b-elevated transition-colors duration-150"
                  >
                    Reanalisar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
