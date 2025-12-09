import { createBrowserRouter } from 'react-router-dom';
import App from '@/App.tsx';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Players from '@/pages/Players';
import Team from '@/pages/Team';
import AddTeam from '@/pages/AddTeam';
import TeamDetails from '@/pages/TeamDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomeRedirect from '@/components/HomeRedirect';
import LeagueDashboard from '@/pages/Leagues';
import LeagueDetails from '@/pages/LeagueDetails';

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
      {
        path: 'leagues',
        element: <LeagueDashboard />,
      },
      {
        path: 'leagues/:leagueId',
        element: <LeagueDetails />,
      },
      {
        path: 'leagues',
        element: <LeagueDashboard />,
      },
      {
        path: 'leagues/:leagueId',
        element: <LeagueDetails />,
      },
    ],
  },
]);
