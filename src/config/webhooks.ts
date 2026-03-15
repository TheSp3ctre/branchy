/**
 * N8N Webhook URLs for Branchy.io analysis pipeline.
 *
 * After importing and activating both workflows in your n8n instance,
 * replace the placeholder base URL below with your actual n8n cloud webhook base URL.
 *
 * Workflow A (POST) — analyze_repo.json   → path: /analyze-repo
 * Workflow B (GET)  — get_status.json     → path: /repo-status?jobId=<uuid>
 */
const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://n8n.srv1205479.hstgr.cloud/webhook-test';

export const N8N_WEBHOOKS = {
  ANALYZE_REPO: `${N8N_BASE_URL}/analyze-repo`,
  GET_STATUS: `${N8N_BASE_URL}/repo-status`,
  SYNC_COMMITS: `${N8N_BASE_URL}/sync-commits`,
  SCAN_DEPS: `${N8N_BASE_URL}/scan-deps`,
  ANALYZE_DEADCODE: `${N8N_BASE_URL}/analyze-deadcode`,
  CALCULATE_HEALTH: `${N8N_BASE_URL}/calculate-health`,
  RUN_FULL_ANALYSIS: `${N8N_BASE_URL}/run-full-analysis`,
  DELETE_GITHUB_REPO: `${N8N_BASE_URL}/delete-github-repo`,
  GENERATE_ONBOARDING: `${N8N_BASE_URL}/generate-onboarding`,
  STORE_INTEGRATION_CREDS: `${N8N_BASE_URL}/store-integration-credentials`,
};
