import { supabase } from '@/lib/supabase';
import { N8N_WEBHOOKS } from '@/config/webhooks';

export interface RepoSettings {
  repoId: string;
  autoAnalyse: boolean;
  autoAnalyseScope: string[];
  analyseOnCommit: boolean;
  analyseIntervalMin: number;
  notifyOnScoreDrop: boolean;
  scoreDropThreshold: number;
  notifyOnCriticalVuln: boolean;
  notifyOnCompletion: boolean;
  notificationChannels: string[];
  lastAnalysisAt: string | null;
  lastAnalysisScore: number | null;
  updatedAt: string;
}

export const repoSettingsService = {
  async get(repoId: string): Promise<RepoSettings | null> {
    const { data, error } = await supabase
      .from('repo_settings')
      .select('*')
      .eq('repoId', repoId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  async update(repoId: string, patch: Partial<RepoSettings>): Promise<void> {
    const { error } = await supabase
      .from('repo_settings')
      .upsert({ repoId, ...patch, updatedAt: new Date().toISOString() });
      
    if (error) throw error;
  },

  async triggerFullAnalysis(repoId: string) {
    return supabase.functions.invoke('run-full-analysis', { 
      body: { repo_id: repoId } 
    });
  },

  async disconnect(repoId: string, repoName: string, repoOwner: string) {
    // 1. Log auditoria
    await supabase.from('repo_destructive_ops').insert({
      repoId,
      operation: 'disconnect',
      repoName,
      repoOwner,
      confirmedByTyping: true,
    });

    // 2. Marcar como desconectado (soft delete)
    const { error } = await supabase
      .from('repositories')
      .update({ 
        status: 'disconnected', 
        disconnected_at: new Date().toISOString() 
      })
      .eq('id', repoId);
      
    if (error) throw error;
  },

  async deleteFromGitHub(repoId: string, repoName: string, repoOwner: string) {
    // 1. Log auditoria
    const { data: opLog } = await supabase.from('repo_destructive_ops').insert({
      repoId,
      operation: 'delete_github',
      repoName,
      repoOwner,
      confirmedByTyping: true,
    }).select().single();

    // 2. Disparar N8n workflow de deleção
    await fetch(N8N_WEBHOOKS.DELETE_GITHUB_REPO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner: repoOwner,
        repo_name: repoName,
        op_log_id: opLog?.id,
      }),
    });

    // 3. Limpar dados do Supabase (ON DELETE CASCADE cuida do resto)
    const { error } = await supabase.from('repositories').delete().eq('id', repoId);
    if (error) throw error;
  }
};
