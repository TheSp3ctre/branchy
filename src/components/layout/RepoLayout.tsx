import { Outlet, useParams } from 'react-router-dom';
import { Topbar } from './Topbar';
import { RepoSidebar } from './RepoSidebar';
import { useBranchyStore } from '@/store/branchyStore';

export function RepoLayout() {
  const { repoId } = useParams();
  const repo = useBranchyStore((s) => (repoId ? s.repos[repoId] : null));

  return (
    <div className="min-h-screen bg-b-base">
      <Topbar owner={repo?.owner} repoName={repo?.repoName} />
      <div className="flex">
        <RepoSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
