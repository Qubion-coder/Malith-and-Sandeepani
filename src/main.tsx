import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AdminPage } from './components/AdminPage.tsx';
import { getGuestFromPath, isAdminPath } from './lib/guest.ts';
import './index.css';

const { pathname } = window.location;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPath(pathname) ? <AdminPage /> : <App guestName={getGuestFromPath(pathname)} />}
  </StrictMode>,
);
