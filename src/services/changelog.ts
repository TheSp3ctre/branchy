import { supabase } from '@/lib/supabase';

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
  async getCommits(repoId: string, currentUserName?: string): Promise<RepoCommit[]> {
    const { data, error } = await supabase
      .from('repo_commits')
      .select('*')
      .eq('repoId', repoId)
      .order('date', { ascending: false });
    
    const mockCommits: RepoCommit[] = [
      {
        id: 'mock-c1',
        repoId,
        commitHash: 'a1b2c3d4',
        author: currentUserName || 'Desenvolvedor',
        message: 'feat: implement advanced neural pattern recognition',
        date: new Date(Date.now() - 3600000).toISOString(),
        filesChanged: 12,
        aiSummary: 'Esta alteração introduz o motor principal de reconhecimento de padrões, otimizado para baixa latência. A IA detectou que isso melhora a performance em 15%.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-c2',
        repoId,
        commitHash: 'e5f6g7h8',
        author: currentUserName || 'Desenvolvedor',
        message: 'fix: resolve memory leak in connection pool',
        date: new Date(Date.now() - 7200000).toISOString(),
        filesChanged: 2,
        aiSummary: 'Correção crítica que evita o esgotamento de conexões com o banco de dados sob carga pesada.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-c3',
        repoId,
        commitHash: 'i9j0k1l2',
        author: currentUserName || 'Desenvolvedor',
        message: 'refactor: simplify data transformation logic',
        date: new Date(Date.now() - 14400000).toISOString(),
        filesChanged: 8,
        aiSummary: 'Simplificação do pipeline de dados, removendo redundâncias e melhorando a legibilidade do código em 20%.',
        createdAt: new Date().toISOString()
      }
    ];

    if (error) {
      console.error('Error fetching commits from Supabase:', error);
      return mockCommits;
    }
    
    // Combine real data with mock data for the prototype
    return [...mockCommits, ...(data || [])];
  }
};
