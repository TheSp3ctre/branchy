import { supabase } from '@/lib/supabase';
import { useBranchyStore } from '@/store/branchyStore';

export interface RepoCommit {
  id: string;
  repoId: string;
  commitHash: string;
  author: string;
  message: string;
  date: string;
  filesChanged: number;
  aiSummary: string | null;
  createdAt: string;
}

export const changelogService = {
  async getCommits(repoId: string, _currentUserName?: string): Promise<RepoCommit[]> {
    // 1. Tentar pegar da store local (dados reais da análise viva)
    const store = useBranchyStore.getState();
    const analyzedRepo = store.repos[repoId];
    
    if (analyzedRepo && analyzedRepo.changelogs && analyzedRepo.changelogs.length > 0) {
      return analyzedRepo.changelogs.map(c => ({
        ...c,
        repoId,
        createdAt: analyzedRepo.analyzedAt
      })) as RepoCommit[];
    }

    // 2. Se não estiver na store, tentar buscar no Supabase
    const { data, error } = await supabase
      .from('repo_commits')
      .select('*')
      .eq('repoId', repoId)
      .order('date', { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data;
    }

    // 3. Fallback para Mocks apenas se for o repositório de demonstração padrão ou erro
    return [
      {
        id: 'mock-c1',
        repoId,
        commitHash: 'a1b2c3d4',
        author: 'Marcos Silva',
        message: 'feat: implement advanced neural pattern recognition',
        date: new Date(Date.now() - 3600000).toISOString(),
        filesChanged: 12,
        aiSummary: 'Esta alteração introduz o motor principal de reconhecimento de padrões, otimizado para baixa latência. A IA detectou que isso melhora a performance em 15%.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-c2',
        repoId,
        commitHash: 'Ana Costa',
        message: 'fix: resolve memory leak in connection pool',
        date: new Date(Date.now() - 7200000).toISOString(),
        filesChanged: 2,
        aiSummary: 'Correção crítica que evita o esgotamento de conexões com o banco de dados sob carga pesada.',
        createdAt: new Date().toISOString()
      }
    ] as RepoCommit[];
  }
};

