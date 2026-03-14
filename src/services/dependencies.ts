import { supabase } from '@/lib/supabase';

export interface DependencyScan {
  id: string;
  repoId: string;
  triggeredBy: string;
  status: string;
  packagesTotal: number;
  vulnerabilities: number;
  outdated: number;
  startedAt: string;
  completedAt: string | null;
}

export interface DependencyIssue {
  id: string;
  scanId: string;
  repoId: string;
  packageName: string;
  currentVersion: string | null;
  latestVersion: string | null;
  category: 'vulnerability' | 'outdated' | 'missing';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  fixAvailable: boolean;
  fixVersion: string | null;
  aiRecommendation: string | null;
  createdAt: string;
}

export const dependencyService = {
  async getLatestScan(repoId: string): Promise<DependencyScan | null> {
    const { data } = await supabase
      .from('dependency_scans')
      .select('*')
      .eq('repoId', repoId)
      .order('startedAt', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  },
  async getIssues(repoId: string): Promise<DependencyIssue[]> {
    const { data } = await supabase
      .from('dependency_issues')
      .select('*')
      .eq('repoId', repoId);
    return data || [];
  }
};
