import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-[52px] flex items-center px-6 md:px-12">
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="flex items-center shrink-0">
          <img src="https://i.imgur.com/d2964li.png" alt="branchy" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5">
            {["Produto", "Pesquisa", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-body text-[13px] text-hint hover:text-foreground transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.user_metadata?.avatar_url}
                alt="Avatar"
                className="w-7 h-7 rounded-full border border-border-subtle"
              />
              <button
                onClick={signOut}
                className="font-mono text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-green-cta text-white font-mono text-[12px] rounded-md px-4 py-[7px] hover:brightness-110 transition-all duration-150"
            >
              Começar grátis →
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
