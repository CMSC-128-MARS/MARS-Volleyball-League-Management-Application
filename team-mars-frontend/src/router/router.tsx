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
import LeagueDashboard from '@/pages/Leagues';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'players',
        element: <Players />,
      },
      {
        path: 'teams',
        element: <Team />,
      },
      {
        path: 'addteam',
        element: <AddTeam />,
      },
      {
        path: 'teams/:teamId',
        element: <TeamDetails />,
      },
      {
        path: 'leagues',
        element: <LeagueDashboard />,
      },
    ],
  },
]);
