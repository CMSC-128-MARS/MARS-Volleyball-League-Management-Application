import { Outlet, useLocation } from 'react-router-dom';
import LoginNavbar from './components/navigation/LoginNavbar';
import DashboardNavbar from './components/navigation/DashboardNavbar';
import Sidebar from './components/navigation/Sidebar';
import { SidebarProvider } from './components/ui/sidebar';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col h-screen w-full">
        {isLoginPage ? <LoginNavbar /> : <DashboardNavbar />}
        {!isLoginPage && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
