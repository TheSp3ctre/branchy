/**
 * N8N Webhook URLs for Branchy.io analysis pipeline.
 *
 * After importing and activating both workflows in your n8n instance,
 * replace the placeholder base URL below with your actual n8n cloud webhook base URL.
 *
 * Workflow A (POST) — analyze_repo.json   → path: /analyze-repo
 * Workflow B (GET)  — get_status.json     → path: /repo-status?jobId=<uuid>
 */
const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://your-instance.app.n8n.cloud/webhook';

export const N8N_WEBHOOKS = {
  ANALYZE_REPO: `${N8N_BASE_URL}/analyze-repo`,
  GET_STATUS: `${N8N_BASE_URL}/repo-status`,
};
