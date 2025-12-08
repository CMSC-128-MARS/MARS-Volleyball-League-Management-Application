import { createBrowserRouter } from 'react-router-dom';
import App from '@/App.tsx';
import LandingPage from '@/pages/LandingPage';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Players from '@/pages/Players';
import Team from '@/pages/Team';
import AddTeam from '@/pages/AddTeam';
import TeamDetails from '@/pages/TeamDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { getCurrentAuthUser } from '@/lib/auth';
import Loader from '@/components/Loader';

function HomeRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setChecking(true);
      void getCurrentAuthUser()
        .then((res) => {
          if (res?.success && res.user) {
            const u = res.user as any;
            const username =
              u?.username ?? (typeof u?.getUsername === 'function' ? u.getUsername() : undefined);
            if (username) setUser(username);
          }
        })
        .catch(() => {
          // ignore
        })
        .finally(() => setChecking(false));
    }
  }, [isAuthenticated, setUser]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  if (checking) return <Loader />;

  return <LandingPage />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'players',
        element: (
          <ProtectedRoute>
            <Players />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams',
        element: (
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        ),
      },
      {
        path: 'addteam',
        element: (
          <ProtectedRoute>
            <AddTeam />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teams/:teamId',
        element: (
          <ProtectedRoute>
            <TeamDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contact',
        element: (
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
