import { Outlet } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar1';
import LandingPage from './pages/LandingPage';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
