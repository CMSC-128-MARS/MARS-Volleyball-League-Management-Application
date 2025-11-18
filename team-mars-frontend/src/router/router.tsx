import { createBrowserRouter } from 'react-router-dom';
import App from '@/App.tsx';
import Home from '@/pages/Home.tsx';
import Contact from '@/pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
]);
