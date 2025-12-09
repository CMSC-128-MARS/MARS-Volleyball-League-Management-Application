import { Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { getCurrentAuthUser } from '@/lib/auth';
import Loader from '@/components/Loader';

export default function HomeRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void getCurrentAuthUser()
      .then((res) => {
        if (res?.success && res.user) {
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
      .catch(() => {
        // ignore
      })
      .finally(() => setChecking(false));
  }, [setUser]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  if (checking) return <Loader />;

  return <LandingPage />;
}
