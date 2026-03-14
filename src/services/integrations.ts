import { supabase } from '@/lib/supabase';
import { N8N_WEBHOOKS } from '@/config/webhooks';

export interface RepoIntegration {
  id: string;
  repoId: string;
  provider: 'slack' | 'jira' | 'notion' | 'github';
  status: 'not_configured' | 'configured' | 'active' | 'error';
  slackChannelId?: string;
  notionPageId?: string;
  jiraProjectKey?: string;
  notifyEvents: string[];
  lastSyncAt?: string;
  errorMessage?: string;
  workspaceName?: string;
}

export const integrationsService = {
  async getRepoIntegrations(repoId: string): Promise<RepoIntegration[]> {
    const { data, error } = await supabase
      .from('repo_integration_config')
      .select('*, user_integrations:user_integrations!inner(workspace_name)')
      .eq('repoId', repoId);
      
    if (error) throw error;
    
    return (data || []).map(d => ({
      ...d,
      workspaceName: d.user_integrations?.workspace_name
    }));
  },

  async toggle(repoId: string, provider: string, active: boolean): Promise<void> {
    const { error } = await supabase
      .from('repo_integration_config')
      .upsert({
        repoId,
        provider,
        status: active ? 'active' : 'configured',
        updatedAt: new Date().toISOString(),
      });
      
    if (error) throw error;
  },

  async updateNotifyEvents(repoId: string, provider: string, events: string[]): Promise<void> {
    const { error } = await supabase
      .from('repo_integration_config')
      .update({ notifyEvents: events })
      .eq('repoId', repoId)
      .eq('provider', provider);
      
    if (error) throw error;
  },

  async configure(userId: string, provider: string, credentials: any): Promise<void> {
    const response = await fetch(N8N_WEBHOOKS.STORE_INTEGRATION_CREDS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, provider, credentials }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to store credentials');
    }
  }
};
