import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { cognitoConfig } from './config/cognito';
import './index.css';
import { router } from './router/router';

Amplify.configure(cognitoConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
