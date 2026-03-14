import { supabase } from '@/lib/supabase';

export interface IntegrationEvent {
  type: string;
  repoId: string;
  payload: any;
  severity?: 'info' | 'warning' | 'critical';
}

export const INTEGRATION_EVENTS = {
  slack: ['code_health_drop', 'critical_vuln', 'new_commit_analyzed', 'dep_outdated'],
  jira: ['critical_vuln', 'code_health_drop', 'circular_dep_detected'],
  notion: ['onboarding_regenerated'],
};

export async function notifyIntegrations(event: IntegrationEvent) {
  const { data: configs } = await supabase
    .from('repo_integration_config')
    .select('provider, slackChannelId, jiraProjectKey, notifyEvents')
    .eq('repoId', event.repoId)
    .eq('status', 'active');

  if (!configs) return;

  for (const config of configs) {
    if (!config.notifyEvents.includes(event.type)) continue;

    // Log the event in Supabase
    await supabase.from('integration_events').insert({
      repoId: event.repoId,
      provider: config.provider,
      eventType: event.type,
      payload: event.payload,
      status: 'sent' // In a real scenario, this would be updated after the actual delivery
    });

    // In a full implementation, this service would trigger separate Edge Functions 
    // or N8n webhooks specific to each provider and event type.
    console.log(`[Integration] Routing ${event.type} to ${config.provider}`);
  }
}
