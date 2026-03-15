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

    if (!data) {
      return {
        id: `mock-dep-scan-${repoId}`,
        repoId,
        triggeredBy: 'manual',
        status: 'completed',
        packagesTotal: 84,
        vulnerabilities: 2,
        outdated: 5,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3500000).toISOString(),
      };
    }
    return data;
  },
  async getIssues(repoId: string): Promise<DependencyIssue[]> {
    const { data } = await supabase
      .from('dependency_issues')
      .select('*')
      .eq('repoId', repoId);
    
    if (!data || data.length === 0) {
      return [
        {
          id: 'mock-dep-i1',
          scanId: 'mock',
          repoId,
          packageName: 'lodash',
          currentVersion: '4.17.15',
          latestVersion: '4.17.21',
          category: 'vulnerability',
          severity: 'critical',
          fixAvailable: true,
          fixVersion: '4.17.21',
          aiRecommendation: 'Atualize imediatamente para evitar Prototype Pollution.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-dep-i2',
          scanId: 'mock',
          repoId,
          packageName: 'express',
          currentVersion: '4.17.1',
          latestVersion: '4.18.2',
          category: 'outdated',
          severity: 'medium',
          fixAvailable: true,
          fixVersion: '4.18.2',
          aiRecommendation: 'Nova versão menor disponível com patches de segurança e performance.',
          createdAt: new Date().toISOString(),
        }
      ];
    }
    return data || [];
  }
};
