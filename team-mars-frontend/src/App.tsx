import { Outlet } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar1';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
