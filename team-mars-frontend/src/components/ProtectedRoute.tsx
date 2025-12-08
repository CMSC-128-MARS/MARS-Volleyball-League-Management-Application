import { ReactElement, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { getCurrentAuthUser } from '@/lib/auth';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const location = useLocation();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated) {
      setChecking(true);
      void getCurrentAuthUser()
        .then((res) => {
          if (mounted && res?.success && res.user) {
            const u = res.user as any;
            const username =
              u?.username ?? (typeof u?.getUsername === 'function' ? u.getUsername() : undefined);
            if (username) setUser(username);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setChecking(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, setUser]);

  if (isAuthenticated) return children;
  if (checking) return <Loader />; // show loader while checking session

  // Not authenticated — redirect to login and preserve attempted location
  return <Navigate to="/login" state={{ from: location }} replace />;
}
