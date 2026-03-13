import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { timeAgo } from '@/lib/branchy-utils';

export default function ChangelogsPage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  return (
    <div className="p-6">
      {/* Filter bar */}
      <div className="flex gap-3 mb-6">
        <select className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 font-mono text-[12px] text-b-text outline-none">
          <option>main</option>
          <option>develop</option>
        </select>
        <input
          type="text"
          placeholder="Data início"
          className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 font-mono text-[12px] text-b-text placeholder:text-b-text-ghost outline-none w-[120px]"
        />
        <input
          type="text"
          placeholder="Data fim"
          className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 font-mono text-[12px] text-b-text placeholder:text-b-text-ghost outline-none w-[120px]"
        />
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-0 bottom-0 w-[1px] bg-b-border" />

        <div className="space-y-4">
          {repo.changelogs.map((cl) => (
            <div key={cl.id} className="relative">
              {/* Dot */}
              <div className="absolute left-[-19px] top-4 w-2 h-2 rounded-full bg-b-green" />

              {/* Card */}
              <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-4 ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] text-b-text-ghost">{cl.commitHash}</span>
                  <span className="w-5 h-5 rounded-full bg-b-blue-bg text-b-blue font-mono text-[9px] flex items-center justify-center">
                    {cl.author.split(' ').map(n => n[0]).join('')}
                  </span>
                  <span className="font-body text-[12px] text-b-text-muted">{cl.author}</span>
                  <span className="font-body text-[11px] text-b-text-ghost ml-auto">{timeAgo(cl.date)}</span>
                </div>
                <p className="font-body text-[14px] text-white">{cl.message}</p>
                <span className="inline-block mt-2 font-mono text-[10px] text-b-text-muted bg-b-elevated px-1.5 py-0.5 rounded-sm">
                  {cl.filesChanged} arquivos alterados
                </span>
                {cl.aiSummary && (
                  <p className="mt-2 font-body text-[13px] text-b-text-secondary italic">{cl.aiSummary}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
