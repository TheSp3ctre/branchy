import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { Trash2, RefreshCw } from 'lucide-react';

type SettingsTab = 'geral' | 'integracoes' | 'acesso' | 'exportar';

export default function RepoSettingsPage() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const [activeTab, setActiveTab] = useState<SettingsTab>('geral');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);

  if (!repo) return <div className="p-6 font-mono text-b-text-ghost">// repositório não encontrado</div>;

  const tabs: { label: string; value: SettingsTab }[] = [
    { label: 'Geral', value: 'geral' },
    { label: 'Integrações', value: 'integracoes' },
    { label: 'Acesso', value: 'acesso' },
    { label: 'Exportar', value: 'exportar' },
  ];

  const integrations = [
    { name: 'GitHub Webhook', description: 'Receba notificações automáticas em cada push', enabled: true },
    { name: 'Slack', description: 'Envie alertas de saúde para um canal Slack', enabled: false },
    { name: 'Jira', description: 'Crie issues automaticamente a partir de problemas', enabled: false },
    { name: 'Notion', description: 'Sincronize o onboarding guide com uma página Notion', enabled: false },
  ];

  const exportFormats = [
    { name: 'Architecture diagram', formats: ['PNG', 'SVG'] },
    { name: 'Dependency graph', formats: ['PNG', 'SVG'] },
    { name: 'Onboarding guide', formats: ['PDF', 'Markdown'] },
    { name: 'Full report', formats: ['PDF'] },
  ];

  return (
    <div className="p-6 max-w-[640px]">
      {/* Tab pills */}
      <div className="flex gap-1.5 mb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`font-mono text-[12px] px-3 py-1.5 rounded-btn transition-colors duration-150 ${
              activeTab === t.value
                ? 'bg-b-card text-b-text border-[0.5px] border-b-border'
                : 'text-b-text-muted hover:text-b-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Geral */}
      {activeTab === 'geral' && (
        <div className="space-y-6">
          <div>
            <label className="font-mono text-[10px] text-b-text-ghost uppercase block mb-1.5">NOME DO REPOSITÓRIO</label>
            <input
              defaultValue={repo.repoName}
              className="w-full bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[13px] text-b-text outline-none focus:border-b-blue transition-colors duration-150"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[13px] text-b-text">Reanalisar agora</div>
              <div className="font-body text-[12px] text-b-text-muted mt-0.5">Última análise: {new Date(repo.analyzedAt).toLocaleString()}</div>
            </div>
            <button className="flex items-center gap-1.5 font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 hover:bg-b-card transition-colors duration-150">
              <RefreshCw size={13} /> Reanalisar
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[13px] text-b-text">Auto-analyze on push</div>
              <div className="font-body text-[12px] text-b-text-muted mt-0.5">Re-analisa automaticamente quando detecta um push</div>
            </div>
            <button
              onClick={() => setAutoAnalyze(!autoAnalyze)}
              className={`w-10 h-5 rounded-full transition-colors duration-150 relative ${autoAnalyze ? 'bg-b-green' : 'bg-b-border-subtle'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-150 ${autoAnalyze ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="border-[0.5px] border-b-red-border rounded-card p-5 mt-6">
            <div className="font-mono text-[13px] text-b-red mb-2">Danger zone</div>
            <p className="font-body text-[12px] text-b-text-muted mb-3">Remover este repositório e todos os dados de análise. Esta ação é irreversível.</p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 font-mono text-[12px] text-b-red border-[0.5px] border-b-red-border rounded-btn px-3 py-1.5 hover:bg-b-red-bg transition-colors duration-150"
            >
              <Trash2 size={13} /> Remover repositório
            </button>
          </div>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integracoes' && (
        <div className="space-y-3">
          {integrations.map((int) => (
            <div key={int.name} className="bg-b-card border-[0.5px] border-b-border rounded-card p-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[13px] text-white">{int.name}</div>
                <div className="font-body text-[12px] text-b-text-muted mt-0.5">{int.description}</div>
              </div>
              <div className="flex items-center gap-3">
                {int.enabled && (
                  <button className="font-mono text-[11px] text-b-green hover:underline">Configurar →</button>
                )}
                <div className={`w-8 h-4 rounded-full ${int.enabled ? 'bg-b-green' : 'bg-b-border-subtle'} relative`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-150 ${int.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Access */}
      {activeTab === 'acesso' && (
        <div>
          <div className="flex gap-2 mb-6">
            <input
              placeholder="email@exemplo.com"
              className="flex-1 bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-3 py-2 font-mono text-[12px] text-b-text placeholder:text-b-text-ghost outline-none"
            />
            <select className="bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn px-2 py-1 font-mono text-[12px] text-b-text outline-none">
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
            <button className="font-mono text-[12px] text-white bg-[#238636] hover:bg-[#2EA043] px-3 py-1.5 rounded-btn transition-colors duration-150">
              Convidar
            </button>
          </div>
          <div className="bg-b-card border-[0.5px] border-b-border rounded-card overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b-[0.5px] border-b-border">
              <span className="w-7 h-7 rounded-full bg-b-blue-bg text-b-blue font-mono text-[10px] flex items-center justify-center mr-3">AC</span>
              <div className="flex-1">
                <div className="font-mono text-[12px] text-white">Acme User</div>
                <div className="font-body text-[11px] text-b-text-muted">user@acme-corp.com</div>
              </div>
              <span className="font-mono text-[10px] text-b-text-muted bg-b-elevated px-1.5 py-0.5 rounded-sm mr-3">Admin</span>
              <button className="font-mono text-[11px] text-b-text-muted hover:text-b-red transition-colors duration-150">Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Export */}
      {activeTab === 'exportar' && (
        <div className="space-y-3">
          {exportFormats.map((exp) => (
            <div key={exp.name} className="bg-b-card border-[0.5px] border-b-border rounded-card p-4 flex items-center justify-between">
              <span className="font-mono text-[13px] text-white">{exp.name}</span>
              <div className="flex gap-2">
                {exp.formats.map((f) => (
                  <button key={f} className="font-mono text-[11px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-2 py-1 hover:bg-b-elevated transition-colors duration-150">
                    {f}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-b-card border-[0.5px] border-b-border rounded-card p-6 max-w-[400px] w-full mx-4">
            <h3 className="font-mono text-[16px] text-white mb-2">Remover repositório</h3>
            <p className="font-body text-[13px] text-b-text-secondary mb-4">
              Tem certeza que deseja remover <strong>{repo.owner}/{repo.repoName}</strong>? Esta ação é irreversível.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 hover:bg-b-elevated transition-colors duration-150"
              >
                Cancelar
              </button>
              <button className="font-mono text-[12px] text-white bg-b-red rounded-btn px-3 py-1.5 hover:opacity-80 transition-opacity duration-150">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
