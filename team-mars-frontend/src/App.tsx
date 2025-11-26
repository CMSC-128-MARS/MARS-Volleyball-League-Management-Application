import { Outlet } from 'react-router-dom';
import Navbar from './components/navigation/LoginNavbar';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
