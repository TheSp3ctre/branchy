import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';

export default function DeadCodePage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const dc = repo.deadCode;
  const moduleCount = dc.filter((d) => d.type === 'module').length;
  const functionCount = dc.filter((d) => d.type === 'function').length;
  const totalLines = dc.reduce((sum, d) => sum + d.linesCount, 0);

  const typeBadge = (type: string) => {
    const styles: Record<string, string> = {
      module: 'bg-b-red-bg border-b-red-border text-b-red',
      function: 'bg-b-yellow-bg border-b-yellow-border text-b-yellow',
      variable: 'bg-b-card border-b-border-subtle text-b-text-muted',
    };
    return styles[type] || styles.variable;
  };

  return (
    <div className="p-6">
      {/* Summary bar */}
      <div className="flex gap-8 mb-6">
        <div>
          <span className="font-mono text-[20px] text-b-red">{moduleCount}</span>
          <span className="font-body text-[13px] text-b-text-muted ml-2">módulos</span>
        </div>
        <div>
          <span className="font-mono text-[20px] text-b-red">{functionCount}</span>
          <span className="font-body text-[13px] text-b-text-muted ml-2">funções</span>
        </div>
        <div>
          <span className="font-mono text-[20px] text-b-red">{totalLines}</span>
          <span className="font-body text-[13px] text-b-text-muted ml-2">linhas</span>
        </div>
      </div>

      {/* Issue cards */}
      <div className="space-y-2">
        {dc.map((item) => (
          <div key={item.id} className="bg-b-card border-[0.5px] border-b-border rounded-card px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[14px] text-white">{item.moduleName}</span>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm border-[0.5px] ${typeBadge(item.type)}`}>
                {item.type}
              </span>
            </div>
            <div className="font-mono text-[11px] text-b-red mt-1">Nenhum consumer detectado</div>
            <div className="font-body text-[12px] text-b-text-ghost mt-1">
              Última modificação: {item.lastModified} · {item.linesCount} linhas · {item.filePath}
            </div>
            <div className="flex gap-3 mt-3">
              <button className="font-mono text-[12px] text-b-green hover:underline">Ver no grafo →</button>
              <button className="font-mono text-[11px] text-b-text-muted border-[0.5px] border-b-border-subtle rounded-btn px-2 py-1 hover:bg-b-elevated transition-colors duration-150">
                Ignorar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
