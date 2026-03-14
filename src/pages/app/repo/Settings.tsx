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

type SettingsTab = 'geral' | 'notificacoes' | 'integracoes' | 'exportar' | 'danger';

const EXPORT_ITEMS = [
  { id: 'architecture', label: 'Diagrama de Arquitetura', formats: ['PNG', 'SVG'] },
  { id: 'dependency', label: 'Grafo de Dependências', formats: ['PNG'] },
  { id: 'onboarding', label: 'Guia de Onboarding', formats: ['MD', 'PDF'] },
  { id: 'full_report', label: 'Relatório Completo ✨', formats: ['PDF'], badge: 'Premium' },
];

export default function RepoSettingsPage() {
  const { repoId } = useParams<{ repoId: string }>();
  // ... existing states ...
  const [activeTab, setActiveTab] = useState<SettingsTab>('geral');
  // ... existing code ...

  const tabs: { label: string; value: SettingsTab; icon: any }[] = [
    { label: 'Geral', value: 'geral', icon: Globe },
    { label: 'Notificações', value: 'notificacoes', icon: Bell },
    { label: 'Integrações', value: 'integracoes', icon: Settings2 },
    { label: 'Exportar', value: 'exportar', icon: ExternalLink },
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
          {/* ... Geral, Integracoes, Notificacoes ... */}

          {/* Exportar */}
          {activeTab === 'exportar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {EXPORT_ITEMS.map((item) => (
                  <div key={item.id} className="bg-b-card border border-b-border rounded-card p-6 flex items-center justify-between hover:border-b-text-ghost transition-all">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-mono text-[14px] text-white">{item.label}</h4>
                        {item.badge && (
                          <span className="bg-b-blue/20 text-b-blue text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">{item.badge}</span>
                        )}
                      </div>
                      <p className="font-body text-[11px] text-b-text-ghost mt-1">Gere um arquivo estático para compartilhamento offline.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.formats.map(format => (
                        <button 
                          key={format}
                          className="font-mono text-[11px] bg-b-surface border border-b-border text-white px-3 py-1.5 rounded-btn hover:bg-white hover:text-black transition-all font-bold"
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-b-surface/50 border border-dashed border-b-border rounded-card p-6">
                <h5 className="font-mono text-[11px] text-b-text-ghost uppercase mb-4 tracking-wider">Últimas Exportações</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px] text-b-text-secondary">
                    <span className="flex items-center gap-2"><Check size={12} className="text-b-green"/> Full_Report_v1.pdf</span>
                    <span>há 2 horas</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-b-text-secondary">
                    <span className="flex items-center gap-2"><Check size={12} className="text-b-green"/> Architecture.png</span>
                    <span>há 1 dia</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ... Danger Zone ... */}
        </motion.div>
      </AnimatePresence>
      {/* ... Setup Modals ... */}
    </div>
  );
}

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
