import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    void getCurrentAuthUser()
      .then((res) => {
        if (mounted && res?.success && res.user) {
          const maybeUser = res.user;

          const isAuthLike = (
            u: unknown,
          ): u is { username?: string; getUsername?: () => string } => {
            if (typeof u !== 'object' || u === null) return false;
            const obj = u as Record<string, unknown>;
            const hasUsername = typeof obj.username === 'string';
            const hasGetUsername = typeof obj.getUsername === 'function';
            return hasUsername || hasGetUsername;
          };

          if (isAuthLike(maybeUser)) {
            const username =
              maybeUser.username ??
              (typeof maybeUser.getUsername === 'function' ? maybeUser.getUsername() : undefined);
            if (username) setUser(username);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setChecking(false);
      });
    return () => {
      mounted = false;
    };
  }, [setUser]);

  if (checking) return <Loader />; // show loader while checking session
  if (isAuthenticated) return children;

  // Not authenticated — redirect to login and preserve attempted location
  return <Navigate to="/login" state={{ from: location }} replace />;
}
