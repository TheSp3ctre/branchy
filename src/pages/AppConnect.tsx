import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ConnectModal from '@/components/ConnectModal';

/**
 * /app/connect
 * Renders the 3-step ConnectModal over the dark app background.
 * Guards against unauthenticated access.
 */
export default function AppConnectPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-[calc(100vh-52px)] bg-b-base flex items-center justify-center">
      <ConnectModal onDismiss={() => navigate('/app/dashboard')} />
    </div>
  );
}
