import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireProfile = false }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--color-text-muted)] font-body">
        Loading AiraFi…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireProfile && !profile) return <Navigate to="/onboarding" replace />;

  return children;
}
