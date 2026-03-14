import { useState } from 'react';
import { Slack, Plug, CheckCircle2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  connected: boolean;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Receba notificações de mudanças críticas e alertas de saúde diretamente no seu workspace.',
      icon: Slack,
      connected: false,
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sincronize documentação técnica e diagramas de arquitetura com suas páginas do Notion.',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M4.459 4.208c.551.314.938.834 1.109 1.458v13.6c0 .484-.258.932-.676 1.176l-1.071.624L2 21.066l1.328-1.554 1.114-.648V6.264l-.99-.576L2 4.208l2.459.0zM22 6.046V18.12c0 .546-.307 1.045-.8 1.285l-1.071.624-1.817.106 1.328-1.554 1.114-.648V7.558l-8.627 5.01-4.041-2.352 8.627-5.01-4.042-2.352-8.627 5.01L5.328 6.42l8.627-5.01L18 3.75l4 2.296z" />
        </svg>
      ),
      connected: false,
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Crie issues automaticamente para dívidas técnicas e bugs identificados pelo branchy.',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M11.53 2c0 2.456-1.991 4.447-4.446 4.447H2V2h9.53zm0 10.47c0 2.456-1.991 4.447-4.446 4.447H2V12.47h9.53zm10.47-5.235c0 2.456-1.991 4.447-4.447 4.447h-5.083V7.235H22zm0 10.47c0 2.456-1.991 4.447-4.447 4.447h-5.083v-4.447H22z" />
        </svg>
      ),
      connected: false,
    },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  return (
    <div className="space-y-4">
      {integrations.map((int) => (
        <div 
          key={int.id}
          className="bg-b-card border-[0.5px] border-b-border rounded-card p-5 flex items-start gap-4"
        >
          <div className="p-2.5 bg-b-surface border-[0.5px] border-b-border-subtle rounded-btn text-b-text">
            <int.icon size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-mono text-[14px] text-white flex items-center gap-2">
                {int.name}
                {int.connected && <CheckCircle2 size={14} className="text-b-green" />}
              </h3>
              <button
                onClick={() => toggleConnection(int.id)}
                className={`font-mono text-[11px] px-3 py-1.5 rounded-btn border-[0.5px] transition-colors duration-150 ${
                  int.connected 
                    ? 'border-b-border-subtle text-b-text-muted hover:text-b-text' 
                    : 'bg-white text-black hover:bg-white/90 border-transparent'
                }`}
              >
                {int.connected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
            <p className="font-body text-[12px] text-b-text-muted leading-relaxed">
              {int.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
