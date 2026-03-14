import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import { Trash2, RefreshCw, Bell, ShieldAlert, Globe, Unlink, Check, AlertTriangle, Loader2, Plus, Settings2, ExternalLink } from 'lucide-react';
import { repoSettingsService, RepoSettings } from '@/services/repoSettings';
import { integrationsService, RepoIntegration } from '@/services/integrations';
import { useAnalysisProgress } from '@/hooks/useAnalysisProgress';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'geral' | 'notificacoes' | 'integracoes' | 'danger';

const INTEGRATION_META = {
  slack: { 
    name: 'Slack', 
    fields: [
      { id: 'bot_token', label: 'Bot Token', type: 'password', hint: 'xoxb-...' },
      { id: 'default_channel', label: 'Canal padrão', type: 'text', hint: '#branchy-alerts' }
    ]
  },
  jira: { 
    name: 'Jira', 
    fields: [
      { id: 'domain', label: 'Domínio', type: 'text', hint: 'empresa.atlassian.net' },
      { id: 'email', label: 'Email', type: 'email' },
      { id: 'api_key', label: 'API Token', type: 'password' }
    ]
  },
  notion: { 
    name: 'Notion', 
    fields: [
      { id: 'token', label: 'Internal Integration Token', type: 'password', hint: 'secret_...' }
    ]
  }
};

export default function RepoSettingsPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('geral');
  const [settings, setSettings] = useState<RepoSettings | null>(null);
  const [integrations, setIntegrations] = useState<RepoIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmName, setConfirmName] = useState('');
  const [dangerAction, setDangerAction] = useState<'disconnect' | 'delete' | null>(null);
  const [setupModal, setSetupModal] = useState<keyof typeof INTEGRATION_META | null>(null);

  const { progress, isRunning, startAnalysis } = useAnalysisProgress(repoId || '');

  useEffect(() => {
    async function loadData() {
      if (!repoId) return;
      try {
        const [s, i] = await Promise.all([
          repoSettingsService.get(repoId),
          integrationsService.getRepoIntegrations(repoId)
        ]);
        setSettings(s);
        setIntegrations(i);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [repoId]);

  const handleUpdate = async (patch: Partial<RepoSettings>) => {
    if (!repoId || !settings) return;
    const newSettings = { ...settings, ...patch };
    setSettings(newSettings);
    await repoSettingsService.update(repoId, patch);
  };

  const handleToggleIntegration = async (provider: string, active: boolean) => {
    if (!repoId) return;
    await integrationsService.toggle(repoId, provider, active);
    const i = await integrationsService.getRepoIntegrations(repoId);
    setIntegrations(i);
  };

  if (!repo || loading) return <div className="p-12 font-mono text-b-text-ghost flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> carregando configurações...</div>;

  const tabs: { label: string; value: SettingsTab; icon: any }[] = [
    { label: 'Geral', value: 'geral', icon: Globe },
    { label: 'Notificações', value: 'notificacoes', icon: Bell },
    { label: 'Integrações', value: 'integracoes', icon: Settings2 },
    { label: 'Danger Zone', value: 'danger', icon: ShieldAlert },
  ];

  return (
    <div className="p-8 max-w-[720px] mx-auto">
      {/* Sidebar-lite Tabs */}
      <div className="flex gap-4 mb-10 border-b-[0.5px] border-b-border pb-4 overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`flex items-center gap-2 font-mono text-[12px] px-4 py-2 rounded-btn transition-all whitespace-nowrap ${
              activeTab === t.value
                ? 'bg-white text-black font-bold'
                : 'text-b-text-ghost hover:text-white'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Geral */}
          {activeTab === 'geral' && (
            <div className="space-y-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-mono text-[14px] text-white">Full Re-Analysis</h3>
                    <p className="font-body text-[12px] text-b-text-ghost mt-1">Sincroniza commits, deps, deadcode e recalcula o Score de Saúde.</p>
                  </div>
                  <button 
                    onClick={startAnalysis}
                    disabled={isRunning}
                    className="flex items-center gap-2 font-mono text-[12px] bg-white text-black px-4 py-2 rounded-btn hover:brightness-90 transition-all disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {isRunning ? 'Em progresso...' : 'Reanalisar agora'}
                  </button>
                </div>

                {progress && (
                  <div className="bg-b-card border border-b-blue/30 rounded-card p-4 space-y-3">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-b-blue animate-pulse">{progress.step_label}</span>
                      <span className="text-white">{progress.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-b-surface rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        className="h-full bg-b-blue" 
                      />
                    </div>
                  </div>
                )}
              </section>

              <div className="h-[1px] bg-b-border" />

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[13px] text-white">Auto-analyze on push</div>
                    <div className="font-body text-[12px] text-b-text-ghost mt-0.5">Disparar scanners detectando novos commits</div>
                  </div>
                  <button
                    onClick={() => handleUpdate({ autoAnalyse: !settings?.autoAnalyse })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${settings?.autoAnalyse ? 'bg-b-blue' : 'bg-b-border-subtle'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings?.autoAnalyse ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Integrações */}
          {activeTab === 'integracoes' && (
            <div className="space-y-4">
              {(['slack', 'jira', 'notion'] as const).map((provider) => {
                const config = integrations.find(i => i.provider === provider);
                const isConnected = !!config;
                const isActive = config?.status === 'active';

                return (
                  <div key={provider} className="bg-b-card border border-b-border rounded-card p-5 group hover:border-b-text-ghost transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-b-surface flex items-center justify-center rounded-card border border-b-border">
                          <img src={`/integrations/${provider}.svg`} alt={provider} className="w-5 h-5 opacity-80" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[14px] text-white capitalize">{provider}</span>
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-b-green animate-pulse" />}
                          </div>
                          <div className="font-body text-[11px] text-b-text-ghost mt-0.5">
                            {isConnected ? `Conectado a ${config.workspaceName || 'Workspace'}` : 'Não configurado'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {!isConnected ? (
                          <button 
                            onClick={() => setSetupModal(provider)}
                            className="flex items-center gap-1.5 font-mono text-[11px] text-b-blue border border-b-blue/30 px-3 py-1.5 rounded-btn hover:bg-b-blue/10 transition-all"
                          >
                            <Plus size={12} /> Configurar
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setSetupModal(provider)}
                              className="p-1.5 text-b-text-ghost hover:text-white transition-colors"
                            >
                              <Settings2 size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleIntegration(provider, !isActive)}
                              className={`w-9 h-4.5 rounded-full transition-colors relative ${isActive ? 'bg-b-green' : 'bg-b-border-subtle'}`}
                            >
                              <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notificacoes' && (
            <div className="space-y-6 bg-b-card border border-b-border rounded-card p-6">
              {[
                { key: 'notifyOnScoreDrop' as const, label: 'Queda de Saúde', desc: 'Alertar se o score cair mais de 5 pontos' },
                { key: 'notifyOnCriticalVuln' as const, label: 'Vulnerabilidades Críticas', desc: 'Alertar imediatamente sobre CVEs graves' },
                { key: 'notifyOnCompletion' as const, label: 'Análise Finalizada', desc: 'Notificar sempre que um job de orquestração terminar' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[13px] text-white">{item.label}</div>
                    <div className="font-body text-[12px] text-b-text-ghost mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => handleUpdate({ [item.key]: !settings?.[item.key] })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${settings?.[item.key] ? 'bg-b-blue' : 'bg-b-border-subtle'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings?.[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="border border-b-red-border/30 rounded-card p-6 bg-b-red-bg/10 group hover:border-b-red-border transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-mono text-[14px] text-b-red flex items-center gap-2">
                      <Unlink size={14} /> Desconectar Repositório
                    </h4>
                    <p className="font-body text-[12px] text-b-text-ghost mt-1 max-w-[400px]">
                      Remove o repositório do Branchy. Dados de análise serão preservados por 30 dias. Código no GitHub permanece intacto.
                    </p>
                  </div>
                  <button 
                    onClick={() => setDangerAction('disconnect')}
                    className="font-mono text-[11px] border border-b-red-border text-b-red px-4 py-2 rounded-btn hover:bg-b-red hover:text-white transition-all shadow-lg"
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Setup Modal */}
      {setupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-b-card border border-b-border rounded-card p-8 max-w-[440px] w-full">
            <h3 className="font-mono text-[18px] text-white font-bold mb-2">Conectar {INTEGRATION_META[setupModal].name}</h3>
            <p className="font-body text-[12px] text-b-text-ghost mb-6">Insira as credenciais para integrar este repositório.</p>
            
            <div className="space-y-4">
              {INTEGRATION_META[setupModal].fields.map(f => (
                <div key={f.id}>
                  <label className="font-mono text-[10px] text-b-text-ghost uppercase mb-1.5 block">{f.label}</label>
                  <input 
                    type={f.type} 
                    className="w-full bg-b-surface border border-b-border rounded-btn px-4 py-2.5 font-mono text-[13px] text-white outline-none focus:border-b-blue transition-all"
                    placeholder={f.hint}
                  />
                </div>
              ))}
              
              <div className="flex gap-3 pt-4">
                <button onClick={() => setSetupModal(null)} className="flex-1 font-mono text-[12px] text-b-text-ghost py-2">Cancelar</button>
                <button className="flex-1 bg-white text-black font-mono text-[12px] py-2 rounded-btn font-bold hover:brightness-90">Validar e Salvar</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modals for Danger actions here... */}
    </div>
  );
}
