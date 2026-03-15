import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult, RecentRepo } from '@/types';
import { mockRepos } from '@/data/mockData';

interface BranchyStore {
  repos: Record<string, AnalysisResult>;
  currentRepoId: string | null;
  isAnalyzing: boolean;
  analysisError: boolean;
  recentRepos: RecentRepo[];
  addRepo: (result: AnalysisResult) => void;
  setRepos: (repos: Record<string, AnalysisResult>) => void;
  setCurrentRepo: (id: string | null) => void;
  setAnalyzing: (v: boolean) => void;
  setAnalysisError: (v: boolean) => void;
  addRecentRepo: (repo: RecentRepo) => void;
  resolveIssue: (repoId: string, issueId: string) => void;
}

export const useBranchyStore = create<BranchyStore>()(
  persist(
    (set) => ({
      repos: mockRepos,
      currentRepoId: null,
      isAnalyzing: false,
      analysisError: false,
      recentRepos: [
        { repoId: 'payments-api', repoUrl: 'acme-corp/payments-api', repoName: 'payments-api', owner: 'acme-corp', status: 'analyzed', analyzedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { repoId: 'frontend-v2', repoUrl: 'acme-corp/frontend-v2', repoName: 'frontend-v2', owner: 'acme-corp', status: 'analyzed', analyzedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
        { repoId: 'nexus-engine', repoUrl: 'TheSp3ctre/nexus-engine', repoName: 'nexus-engine', owner: 'TheSp3ctre', status: 'analyzed', analyzedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { repoId: 'auth-service', repoUrl: 'acme-corp/auth-service', repoName: 'auth-service', owner: 'acme-corp', status: 'analyzed', analyzedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      ],
      addRepo: (result) =>
        set((state) => ({
          repos: { ...state.repos, [result.repoId]: result },
        })),
      setRepos: (repos) => set({ repos }),
      setCurrentRepo: (id) => set({ currentRepoId: id }),
      setAnalyzing: (v) => set({ isAnalyzing: v }),
      setAnalysisError: (v) => set({ analysisError: v }),
      addRecentRepo: (repo) =>
        set((state) => ({
          recentRepos: [repo, ...state.recentRepos.filter((r) => r.repoId !== repo.repoId)].slice(0, 10),
        })),
      resolveIssue: (repoId, issueId) =>
        set((state) => {
          const repo = state.repos[repoId];
          if (!repo) return state;
          return {
            repos: {
              ...state.repos,
              [repoId]: {
                ...repo,
                healthReport: {
                  ...repo.healthReport,
                  issues: repo.healthReport.issues.map((i) =>
                    i.id === issueId ? { ...i, resolved: true } : i
                  ),
                },
              },
            },
          };
        }),
    }),
    { name: 'branchy-store' }
  )
);
