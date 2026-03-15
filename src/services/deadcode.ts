import { supabase } from '@/lib/supabase';

export interface DeadcodeRun {
  id: string;
  repoId: string;
  triggeredBy: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  filesScanned: number;
  aiSummary: string | null;
}

export interface DeadcodeIssue {
  id: string;
  runId: string;
  repoId: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  filePath: string;
  lineStart: number | null;
  symbol: string | null;
  message: string;
  fixSuggestion: string | null;
  createdAt: string;
}

export const deadcodeService = {
  async getLatestRun(repoId: string): Promise<DeadcodeRun | null> {
    const { data } = await supabase
      .from('deadcode_runs')
      .select('*')
      .eq('repoId', repoId)
      .order('startedAt', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (!data) {
      return {
        id: `mock-dead-run-${repoId}`,
        repoId,
        triggeredBy: 'manual',
        status: 'completed',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3500000).toISOString(),
        filesScanned: 154,
        aiSummary: "A análise detectou diversos módulos órfãos e funções que não são mais referenciadas após a última grande refatoração de infraestrutura."
      };
    }
    return data;
  },
  async getIssues(repoId: string, runId?: string): Promise<DeadcodeIssue[]> {
    let query = supabase.from('deadcode_issues').select('*').eq('repoId', repoId);
    if (runId) query = query.eq('runId', runId);
    
    const { data } = await query.order('severity', { ascending: false });
    
    if (!data || data.length === 0) {
      return [
        {
          id: 'mock-d1',
          runId: runId || 'mock',
          repoId,
          type: 'dead-code',
          severity: 'critical',
          filePath: 'src/legacy/OldPaymentHandler.ts',
          lineStart: 1,
          symbol: 'OldPaymentHandler',
          message: 'Este módulo completo não possui importações em nenhum lugar do projeto.',
          fixSuggestion: 'Remova o arquivo para reduzir o tamanho do bundle e complexidade.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'mock-d2',
          runId: runId || 'mock',
          repoId,
          type: 'complexity',
          severity: 'high',
          filePath: 'src/core/CoreEngine.ts',
          lineStart: 142,
          symbol: 'processInternalState',
          message: 'A função processInternalState possui uma complexidade ciclomática de 42.',
          fixSuggestion: 'Refatore dividindo a lógica de processamento em pequenos validadores independentes.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'mock-d3',
          runId: runId || 'mock',
          repoId,
          type: 'duplication',
          severity: 'medium',
          filePath: 'src/utils/formatters.ts',
          lineStart: 45,
          symbol: 'formatCurrency',
          message: 'Lógica idêntica encontrada em src/services/PaymentService.ts:L89',
          fixSuggestion: 'Centralize a lógica de formatação no utilitário compartilhado.',
          createdAt: new Date().toISOString()
        }
      ];
    }
    return data || [];
  }
};
