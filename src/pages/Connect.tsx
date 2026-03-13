import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ConnectModal from '@/components/ConnectModal';

/**
 * /app/connect
 *
 * Route shown after GitHub OAuth callback when the user has no analyzed repos.
 * Renders the persistent 3-step modal over a dark background.
 * If the user is not authenticated, redirects to /login.
 */
const Connect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D1117',
      }}
    >
      <ConnectModal />
    </div>
  );
};

export default Connect;
