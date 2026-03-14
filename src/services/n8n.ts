import { N8N_WEBHOOKS } from '@/config/webhooks';

export const n8nService = {
  async syncCommits(repoId: string) {
    const response = await fetch(N8N_WEBHOOKS.SYNC_COMMITS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_id: repoId }),
    });
    if (!response.ok) {
      throw new Error(`N8n sync-commits failed: ${response.status}`);
    }
    return response.json();
  },
  async scanDeps(repoId: string) {
    const response = await fetch(N8N_WEBHOOKS.SCAN_DEPS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_id: repoId, triggered_by: 'manual' }),
    });
    if (!response.ok) {
      throw new Error(`N8n scan-deps failed: ${response.status}`);
    }
    return response.json();
  },
  async analyzeDeadcode(repoId: string) {
    const response = await fetch(N8N_WEBHOOKS.ANALYZE_DEADCODE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_id: repoId, triggered_by: 'manual' }),
    });
    if (!response.ok) {
      throw new Error(`N8n analyze-deadcode failed: ${response.status}`);
    }
    return response.json();
  }
};
