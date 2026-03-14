import { NavLink, useParams } from 'react-router-dom';
import { useBranchyStore } from '@/store/branchyStore';
import {
  LayoutGrid, Network, GitBranch, BookOpen,
  HeartPulse, Trash2, FileText, Plug, Users
} from 'lucide-react';

const viewItems = [
  { label: 'Overview', icon: LayoutGrid, path: '' },
  { label: 'Architecture map', icon: Network, path: '/architecture' },
  { label: 'Dependency graph', icon: GitBranch, path: '/dependencies' },
  { label: 'Onboarding guide', icon: BookOpen, path: '/onboarding' },
];

const analysisItems = [
  { label: 'Code health', icon: HeartPulse, path: '/health' },
  { label: 'Dead code', icon: Trash2, path: '/dead-code' },
  { label: 'Changelogs', icon: FileText, path: '/changelogs' },
];

const settingsItems = [
  { label: 'Integrações', icon: Plug, path: '/settings' },
];

function SidebarNavItem({ label, icon: Icon, to }: { label: string; icon: any; to: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 font-body text-[13px] transition-colors duration-150 ${
          isActive
            ? 'bg-b-card border-l-2 border-b-green text-b-text'
            : 'border-l-2 border-transparent text-b-text-secondary hover:bg-b-card'
        }`
      }
    >
      <Icon size={15} className="shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export function RepoSidebar() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));
  const basePath = `/app/repo/${repoId}`;

  return (
    <aside className="w-[220px] bg-b-surface border-r-[0.5px] border-b-border shrink-0 sticky top-[52px] h-[calc(100vh-52px)] flex flex-col overflow-y-auto">
      {/* Repo info */}
      <div className="p-4 border-b-[0.5px] border-b-border">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] text-white truncate">{repo?.repoName || repoId}</span>
          <span className="w-2 h-2 rounded-full bg-b-green shrink-0" />
        </div>
        <span className="font-mono text-[11px] text-b-text-muted">{repo?.owner}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        <div className="px-4 pt-4 pb-2">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em]">VIEWS</span>
        </div>
        {viewItems.map((item) => (
          <SidebarNavItem key={item.path} label={item.label} icon={item.icon} to={`${basePath}${item.path}`} />
        ))}

        <div className="px-4 pt-5 pb-2">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em]">ANÁLISE</span>
        </div>
        {analysisItems.map((item) => (
          <SidebarNavItem key={item.path} label={item.label} icon={item.icon} to={`${basePath}${item.path}`} />
        ))}

        <div className="px-4 pt-5 pb-2">
          <span className="font-mono text-[10px] text-b-text-ghost uppercase tracking-[0.1em]">CONFIGURAÇÕES</span>
        </div>
        {settingsItems.map((item) => (
          <SidebarNavItem key={item.label} label={item.label} icon={item.icon} to={`${basePath}${item.path}`} />
        ))}
      </nav>

      {/* Plan badge */}
      <div className="p-4 border-t-[0.5px] border-b-border">
        <span className="font-mono text-[10px] bg-b-elevated text-b-text-muted px-2 py-0.5 rounded-full">FREE</span>
        <button className="block mt-2 font-mono text-[11px] text-b-green hover:underline">
          Upgrade →
        </button>
      </div>
    </aside>
  );
}
