import { Outlet } from 'react-router-dom';
import Navbar from './components/navigation/LoginNavbar';
import AuthTest from './components/AuthTest'; // Import the AuthTest component, for testing only

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <AuthTest />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
