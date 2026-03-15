import { supabase } from '@/lib/supabase';
import { N8N_WEBHOOKS } from '@/config/webhooks';

export interface OnboardingGuide {
  id: string;
  repoId: string;
  persona: 'developer' | 'stakeholder' | 'auditor';
  title: string;
  contentMd: string;
  stackBadges: string[];
  mermaidArch: string | null;
  wordCount: number | null;
  modelUsed: string;
  generationTimeMs: number | null;
  createdAt: string;
}

export const onboardingService = {
  async getLatest(repoId: string, persona: string = 'developer'): Promise<OnboardingGuide | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_guides')
        .select('*')
        .eq('repoId', repoId)
        .eq('persona', persona)
        .order('createdAt', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (data && !error) return data;
    } catch (err) {
      console.warn('Supabase fetch failed, providing mock data for prototype.');
    }

    // Mock content based on persona (Fallback para protótipo)
    const contentMd = persona === 'developer' 
      ? `# Guia Técnico do Motor Nexus\n\nBem-vindo ao core do sistema. Este repositório utiliza uma arquitetura de microserviços orientada a eventos.\n\n## Arquitetura\n\`\`\`mermaid\ngraph TD\n  A[API Gateway] --> B[Event Bus]\n  B --> C[Worker Service]\n  C --> D[(PostgreSQL)]\n  B --> E[Audit Service]\n\`\`\`\n\n## Stack\n- **Runtime**: Node.js 20.x\n- **Linguagem**: TypeScript\n- **Infra**: Docker & Kubernetes\n\n## Primeiros Passos\n1. Copie o \`.env.example\`\n2. Rode \`docker-compose up -d\`\n3. Execute \`npm run build && npm run start\`\n\n### 🤖 IA Insights\n> **@AI**: Notei que o arquivo \`auth.ts\` está usando um padrão de singleton que pode dificultar testes unitários. Recomendo extrair para uma interface de Injeção de Dependência.\n> \n> **@AI**: A cobertura de testes no módulo de processamento caiu 5% no último commit. Considere adicionar testes para os casos de borda do novo parser.`
      : persona === 'stakeholder'
      ? `# Visão de Negócio — Nexus Engine\n\nO Nexus Engine é responsável por 90% do processamento de dados da empresa, garantindo conformidade e velocidade.\n\n## Impacto\n- **Velocidade**: Redução de 45% no tempo de resposta.\n- **Escalabilidade**: Suporta até 1.2M de requests/min.\n- **Segurança**: Criptografia de ponta a ponta.\n\n## Roadmap\n- Q3: Integração com provedores externos.\n- Q4: Expansão para mercados asiáticos.\n\n### 🤖 IA Insights\n> **@AI**: Baseado no volume atual de commits, a funcionalidade "Export" tem 85% de chance de ser entregue antes do prazo previsto.\n> \n> **@AI**: Identificamos um custo potencial de infraestrutura que pode ser reduzido em 12% otimizando as queries de agregação.`
      : `# Auditoria e Segurança\n\nRelatório gerado pela IA Branchy sobre a integridade do código.\n\n## Vulnerabilidades Detectadas\n- [CRITICAL] Injeção de dependência na camada de rede.\n- [INFO] Versão do Node.js está 2 patches atrás.\n\n## Recomendações\n- Implementar rotação de chaves a cada 30 dias.\n- Habilitar logs estruturados para conformidade ISO-27001.\n\n### 🤖 IA Insights\n> **@AI**: O padrão de acesso ao banco de dados sugere que não há logs de auditoria suficientes para conformidade total com SOC2 na tabela de usuários.\n> \n> **@AI**: Detectei um possível vazamento de credenciais em um commit de 3 dias atrás na branch \`feature/legacy-sync\`. Recomendo invalidar os tokens imediatamente.`;

    return {
      id: `mock-onboarding-${repoId}-${persona}`,
      repoId,
      persona: persona as any,
      title: `Onboarding: ${repoId} (${persona})`,
      contentMd,
      stackBadges: ['TypeScript', 'Node.js', 'PostgreSQL'],
      mermaidArch: null,
      wordCount: 450,
      modelUsed: 'Gemini 2.0 Flash',
      generationTimeMs: 2400,
      createdAt: new Date().toISOString()
    };
  },

  async generate(repoId: string, persona: string): Promise<void> {
    const response = await fetch(N8N_WEBHOOKS.GENERATE_ONBOARDING, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_id: repoId, persona }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate onboarding: ${response.statusText}`);
    }
  }
};
