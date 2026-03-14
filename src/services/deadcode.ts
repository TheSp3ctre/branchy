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
    return data;
  },
  async getIssues(repoId: string, runId?: string): Promise<DeadcodeIssue[]> {
    let query = supabase.from('deadcode_issues').select('*').eq('repoId', repoId);
    if (runId) query = query.eq('runId', runId);
    
    const { data } = await query.order('severity', { ascending: false });
    return data || [];
  }
};
