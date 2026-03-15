import { supabase } from '@/lib/supabase';

export interface CodeHealthRun {
  id: string;
  repoId: string;
  scoreOverall: number;
  scoreSecurity: number | null;
  scoreArch: number | null;
  scoreMaintain: number | null;
  scoreTests: number | null;
  scoreDocs: number | null;
  deltaScore: number | null;
  triggeredBy: string;
  aiSummary: string | null;
  createdAt: string;
}

export interface CodeHealthIssue {
  id: string;
  runId: string;
  repoId: string;
  dimension: 'security' | 'architecture' | 'maintainability' | 'tests' | 'documentation';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  aiExplanation: string | null;
  aiFix: string | null;
  createdAt: string;
}

export const codeHealthService = {
  async getLatestRun(repoId: string): Promise<CodeHealthRun | null> {
    const { data } = await supabase
      .from('code_health_runs')
      .select('*')
      .eq('repoId', repoId)
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) {
      // Return mock run for demo
      return {
        id: `mock-run-${repoId}`,
        repoId,
        scoreOverall: 84,
        scoreSecurity: 92,
        scoreArch: 78,
        scoreMaintain: 81,
        scoreTests: 65,
        scoreDocs: 88,
        deltaScore: 3,
        triggeredBy: 'manual',
        aiSummary: "A arquitetura do projeto está sólida, mas detectamos uma concentração alta de lógica no core engine. Recomendamos refatorar o processador principal para melhorar a manutenibilidade.",
        createdAt: new Date().toISOString(),
      };
    }
    return data;
  },
  async getIssues(runId: string): Promise<CodeHealthIssue[]> {
    const { data } = await supabase
      .from('code_health_issues')
      .select('*')
      .eq('runId', runId)
      .order('severity', { ascending: false });
    
    if (!data || data.length === 0) {
      return [
        {
          id: 'mock-h1',
          runId,
          repoId: 'mock',
          dimension: 'maintainability',
          severity: 'critical',
          message: 'Complexidade ciclomática alta no módulo central',
          aiExplanation: 'Este módulo contém mais de 50 caminhos de execução possíveis, o que torna o código difícil de testar e propenso a bugs em casos de borda.',
          aiFix: 'Sugestão: Quebre a função principal em sub-funções menores ou utilize o padrão Strategy para delegar responsabilidades.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-h2',
          runId,
          repoId: 'mock',
          dimension: 'security',
          severity: 'high',
          message: 'Dependência vulnerável detectada (lodas < 4.17.21)',
          aiExplanation: 'Versões antigas do lodash possuem vulnerabilidades conhecidas de Prototype Pollution.',
          aiFix: 'npm install lodash@latest',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-h3',
          runId,
          repoId: 'mock',
          dimension: 'architecture',
          severity: 'medium',
          message: 'Acoplamento forte entre UI e API',
          aiExplanation: 'Os componentes de UI estão chamando a API diretamente sem uma camada de abstração (hooks/services), dificultando a troca de provedores no futuro.',
          aiFix: 'Extraia as chamadas de fetch para serviços dedicados.',
          createdAt: new Date().toISOString(),
        }
      ];
    }
    return data || [];
  },
  async getHistory(repoId: string): Promise<Pick<CodeHealthRun, 'createdAt' | 'scoreOverall'>[]> {
    const { data } = await supabase
      .from('code_health_runs')
      .select('createdAt, scoreOverall')
      .eq('repoId', repoId)
      .order('createdAt', { ascending: true })
      .limit(30);
    
    if (!data || data.length === 0) {
      return Array.from({ length: 10 }).map((_, i) => ({
        createdAt: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
        scoreOverall: 70 + Math.floor(Math.random() * 20),
      }));
    }
    return data || [];
  }
};
