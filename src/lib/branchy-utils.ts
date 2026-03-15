export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 30) return `${days}d atrás`;
  return `${Math.floor(days / 30)}mo atrás`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-b-green';
  if (score >= 50) return 'text-b-yellow';
  return 'text-b-red';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-b-green-bg border-b-green-border text-b-green';
  if (score >= 50) return 'bg-b-yellow-bg border-b-yellow-border text-b-yellow';
  return 'bg-b-red-bg border-b-red-border text-b-red';
}

export function getSeverityColor(severity: string): string {
  if (severity === 'critical' || severity === 'high') return 'bg-b-red';
  if (severity === 'warning' || severity === 'medium') return 'bg-b-yellow';
  if (severity === 'low') return 'bg-b-blue';
  return 'bg-b-blue'; // info and others
}

export function getModuleColor(type: string) {
  switch (type) {
    case 'core': return { bg: 'bg-b-blue-bg', border: 'border-b-blue-border', text: 'text-b-blue' };
    case 'service': return { bg: 'bg-b-green-bg', border: 'border-b-green-border', text: 'text-b-green' };
    case 'util': return { bg: 'bg-b-card', border: 'border-b-border-subtle', text: 'text-b-text-secondary' };
    case 'flagged': return { bg: 'bg-b-yellow-bg', border: 'border-b-yellow-border', text: 'text-b-yellow' };
    case 'component': return { bg: 'bg-b-purple-bg', border: 'border-b-purple-border', text: 'text-b-purple' };
    default: return { bg: 'bg-b-card', border: 'border-b-border-subtle', text: 'text-b-text-secondary' };
  }
}
