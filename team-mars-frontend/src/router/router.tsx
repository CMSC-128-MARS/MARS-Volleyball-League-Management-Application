import { createBrowserRouter } from 'react-router-dom';
import App from '@/App.tsx';
import LandingPage from '@/pages/LandingPage';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';

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
    ],
  },
]);
