import { supabase } from '@/lib/supabase';
import { useBranchyStore } from '@/store/branchyStore';

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
    // 1. Tentar pegar da store local (da análise viva que acabamos de fazer)
    const store = useBranchyStore.getState();
    const repo = store.repos[repoId];

    if (repo && repo.onboardingGuide) {
      const { onboardingGuide } = repo;
      // Transformar o formato da store para o formato esperado pelo componente
      const overview = onboardingGuide.sections.find(s => s.type === 'overview')?.content || '';
      const stack = onboardingGuide.sections.find(s => s.type === 'techStack')?.content || [];
      const scripts = onboardingGuide.sections.find(s => s.type === 'runLocally')?.content || [];

      let contentMd = `# Guia de Onboarding: ${repo.repoName}\n\n${overview}\n\n`;
      
      if (persona === 'developer') {
        contentMd += `## Stack Tecnológica\n${stack.map((s: string) => `- ${s}`).join('\n')}\n\n`;
        contentMd += `## Como rodar localmente\n${scripts.map((s: string) => `1. \`npm run ${s}\``).join('\n')}\n\n`;
        contentMd += `## Arquitetura Sugerida\n\`\`\`mermaid\ngraph TD\n  Web[Frontend] --> API[Core Service]\n  API --> DB[(Database)]\n\`\`\``;
      } else if (persona === 'stakeholder') {
        contentMd += `## Visão de Negócio\nEste repositório é escrito em ${repo.language} e possui ${repo.filesCount} arquivos. A saúde do código está em ${repo.healthScore}%.`;
      }

      return {
        id: `live-${repoId}-${persona}`,
        repoId,
        persona: persona as any,
        title: `Onboarding: ${repo.repoName} (${persona})`,
        contentMd,
        stackBadges: stack.slice(0, 3),
        mermaidArch: null,
        wordCount: contentMd.split(' ').length,
        modelUsed: 'Branchy Local Analyzer',
        generationTimeMs: 1200,
        createdAt: repo.analyzedAt
      };
    }

    // 2. Fallback para Supabase (se já foi salvo antes)
    const { data, error } = await supabase
      .from('onboarding_guides')
      .select('*')
      .eq('repoId', repoId)
      .eq('persona', persona)
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (data && !error) return data;

    // 3. Mock básico se nada for encontrado
    return {
      id: `mock-onboarding-${repoId}-${persona}`,
      repoId,
      persona: persona as any,
      title: `Onboarding: ${repoId} (${persona})`,
      contentMd: `# Bem-vindo ao repositório\n\nEste é um guia gerado automaticamente. Clique em "Analisar" no Dashboard para ver dados reais.`,
      stackBadges: ['TypeScript', 'Node.js'],
      mermaidArch: null,
      wordCount: 15,
      modelUsed: 'Mock',
      generationTimeMs: 0,
      createdAt: new Date().toISOString()
    };
  },

  async generate(_repoId: string, _persona: string): Promise<void> {
    // Agora a geração é feita no ConnectModal via githubAnalyzer
    console.log('Generation is handled by the local analyzer.');
  }
};

