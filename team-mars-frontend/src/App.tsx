import { Outlet } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar1';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Outlet />
    </>
  );
}

export default App;
