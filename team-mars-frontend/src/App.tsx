import { Outlet, useLocation } from 'react-router-dom';
import LoginNavbar from './components/navigation/LoginNavbar';
import DashboardNavbar from './components/navigation/DashboardNavbar';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen">
      {isHomePage ? <LoginNavbar /> : <DashboardNavbar /> }
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
