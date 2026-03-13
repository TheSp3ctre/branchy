import { Settings, CreditCard, Users } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const settingsNav = [
  { label: 'Geral', path: '/app/settings', icon: Settings },
  { label: 'Billing', path: '/app/settings/billing', icon: CreditCard },
  { label: 'Team', path: '/app/settings/team', icon: Users },
];

export default function AccountSettingsPage() {
  return (
    <div className="max-w-[800px] mx-auto py-8 px-6">
      <h1 className="font-mono text-[20px] text-white mb-6">Configurações</h1>

      <div className="flex gap-6">
        <nav className="w-[180px] shrink-0 space-y-1">
          {settingsNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-btn font-mono text-[12px] transition-colors duration-150 ${
                  isActive ? 'bg-b-card text-b-text' : 'text-b-text-muted hover:text-b-text-secondary'
                }`
              }
            >
              <item.icon size={14} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
