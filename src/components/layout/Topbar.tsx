import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TopbarProps {
  owner?: string;
  repoName?: string;
}

export function Topbar({ owner, repoName }: TopbarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /** Initials or avatar fallback */
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'AC';

  return (
    <header className="h-[52px] bg-b-base border-b-[0.5px] border-b-border sticky top-0 z-50 flex items-center px-6">
      {/* Left: Logo */}
      <Link to="/app/dashboard" className="flex items-center shrink-0">
        <img src="https://i.imgur.com/d2964li.png" alt="branchy" className="h-10 w-auto" />
      </Link>

      {/* Center: Breadcrumb */}
      <div className="flex-1 flex items-center justify-center">
        {owner && repoName && (
          <div className="font-mono text-[13px] text-b-text-muted">
            <Link to="/app/dashboard" className="hover:text-b-text-secondary transition-colors duration-150">
              {owner}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-b-text-secondary">{repoName}</span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/app/connect')}
          className="font-mono text-[12px] text-b-text-secondary border-[0.5px] border-b-border-subtle rounded-btn px-3 py-1.5 hover:bg-b-card transition-colors duration-150"
        >
          + Conectar repo
        </button>

        <div className="relative" ref={dropdownRef}>
          {/* Avatar: real GitHub avatar or initials */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity duration-150"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-b-blue-bg text-b-blue font-mono text-[12px] font-medium flex items-center justify-center">
                {initials}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 w-48 bg-b-card border-[0.5px] border-b-border rounded-card py-1 z-50">
              {user?.email && (
                <div className="px-4 py-2 font-body text-[11px] text-b-text-ghost border-b-[0.5px] border-b-border mb-1 truncate">
                  {user.email}
                </div>
              )}
              <button
                onClick={() => { navigate('/app/settings'); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 font-mono text-[12px] text-b-text-secondary hover:bg-b-surface transition-colors duration-150"
              >
                <Settings size={14} />
                Configurações
              </button>
              <div className="border-t-[0.5px] border-b-border my-1" />
              <button
                onClick={() => { signOut(); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 font-mono text-[12px] text-b-red hover:bg-b-surface transition-colors duration-150"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
