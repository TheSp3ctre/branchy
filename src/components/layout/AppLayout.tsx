import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-b-base">
      <Topbar />
      <Outlet />
    </div>
  );
}
