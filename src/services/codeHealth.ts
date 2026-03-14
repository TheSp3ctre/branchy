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
    return data;
  },
  async getIssues(runId: string): Promise<CodeHealthIssue[]> {
    const { data } = await supabase
      .from('code_health_issues')
      .select('*')
      .eq('runId', runId)
      .order('severity', { ascending: false });
    return data || [];
  },
  async getHistory(repoId: string): Promise<Pick<CodeHealthRun, 'createdAt' | 'scoreOverall'>[]> {
    const { data } = await supabase
      .from('code_health_runs')
      .select('createdAt, scoreOverall')
      .eq('repoId', repoId)
      .order('createdAt', { ascending: true })
      .limit(30);
    return data || [];
  }
};
