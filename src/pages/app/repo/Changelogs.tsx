import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/branchy-utils';
import { changelogService, RepoCommit } from '@/services/changelog';
import { useAuth } from '@/contexts/AuthContext';
import { githubAnalyzer } from '@/services/githubAnalyzer';
import { useBranchyStore } from '@/store/branchyStore';

export default function ChangelogsPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const addRepo = useBranchyStore((s) => s.addRepo);
  const { session, user } = useAuth();
  const [commits, setCommits] = useState<RepoCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommits = async () => {
    if (!repoId) return;
    try {
      setLoading(true);
      const data = await changelogService.getCommits(repoId);
      setCommits(data);
    } catch (err) {
      console.error('Failed to fetch commits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!repoId || !repo || !session?.provider_token) return;
    try {
      setRefreshing(true);
      // Re-analisar localmente para pegar commits novos
      const result = await githubAnalyzer.analyzeRepo(
        repo.repoName,
        repo.owner,
        session.provider_token,
        repoId
      );
      addRepo(result);
      setCommits(result.changelogs.map(c => ({ ...c, repoId, createdAt: result.analyzedAt })) as RepoCommit[]);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, [repoId]);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-b-card h-24 rounded-card border-[0.5px] border-b-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <select className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 font-mono text-[12px] text-b-text outline-none">
            <option>main</option>
            <option>develop</option>
          </select>
          <input
            type="text"
            placeholder="Filtrar por mensagem..."
            className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 font-mono text-[12px] text-b-text placeholder:text-b-text-ghost outline-none w-[200px]"
          />
        </div>
        
        <button 
          onClick={handleSync}
          disabled={refreshing}
          className="font-mono text-[12px] text-b-green border-[0.5px] border-b-green/30 rounded-btn px-3 py-1.5 hover:bg-b-green/10 transition-colors disabled:opacity-50"
        >
          {refreshing ? 'Sincronizando...' : 'Sincronizar agora'}
        </button>
      </div>

      {commits.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-mono text-[14px] text-b-text-ghost">Nenhum commit encontrado para este repositório.</p>
          <button onClick={handleSync} className="mt-4 text-b-green font-mono text-[12px] hover:underline">
            Tentar sincronizar agora →
          </button>
        </div>
      ) : (
        /* Timeline */
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-[1px] bg-b-border" />

          <div className="space-y-4">
            {commits.map((cl) => (
              <div key={cl.id} className="relative">
                {/* Dot */}
                <div className="absolute left-[-19px] top-4 w-2 h-2 rounded-full bg-b-green shadow-[0_0_8px_rgba(16,185,129,0.4)]" />

                {/* Card */}
                <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-4 ml-4 hover:border-b-green/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[11px] text-b-text-ghost">{cl.commitHash.substring(0, 7)}</span>
                    <div className="w-5 h-5 rounded-full overflow-hidden border-[0.5px] border-b-border-subtle shrink-0">
                      {user?.user_metadata?.avatar_url && cl.author === (user?.user_metadata?.full_name || user?.user_metadata?.user_name) ? (
                        <img src={user.user_metadata.avatar_url} alt={cl.author} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-b-blue-bg text-b-blue font-mono text-[9px] flex items-center justify-center">
                          {cl.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-body text-[12px] text-b-text-muted">{cl.author}</span>
                    <span className="font-body text-[11px] text-b-text-ghost ml-auto">{timeAgo(cl.date)}</span>
                  </div>
                  <p className="font-body text-[14px] text-white group-hover:text-b-green transition-colors">{cl.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-[10px] text-b-text-muted bg-b-elevated px-1.5 py-0.5 rounded-sm">
                      {cl.filesChanged} arquivos
                    </span>
                  </div>
                  {cl.aiSummary && (
                    <div className="mt-3 bg-b-surface/50 p-2 rounded-sm border-l-2 border-b-blue">
                      <p className="font-body text-[13px] text-b-text-secondary italic line-clamp-2">
                        {cl.aiSummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
