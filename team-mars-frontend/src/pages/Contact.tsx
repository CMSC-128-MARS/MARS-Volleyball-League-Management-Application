import { useNavigate } from 'react-router-dom';
import Contact from '../components/forms/contact';

export default function ContactSupport() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-full w-full flex flex-col justify-center items-center px-4 lg:px-0"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <div>
        <Contact onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}
