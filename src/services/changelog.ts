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
  async getCommits(repoId: string): Promise<RepoCommit[]> {
    const { data, error } = await supabase
      .from('repo_commits')
      .select('*')
      .eq('repoId', repoId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching commits:', error);
      throw error;
    }
    return data || [];
  }
};
