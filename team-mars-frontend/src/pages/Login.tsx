import { useState } from 'react';
import LogIn from '../components/forms/login';
import Contact from '../components/forms/contact';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div
      className="relative w-full h-full bg-primary flex flex-col justify-center items-center px-4 lg:px-0"
      style={{
        backgroundImage: `url('/assets/Dust.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      {showContact && (
        <button
          onClick={() => setShowContact(false)}
          aria-label="Back to login"
          className="text-secondary hover:cursor-pointer z-10 flex flex-row items-center justify-start gap-2 min-h-9 px-4 py-[7.5px] rounded-[2px] border-2 border-secondary bg-transparent mb-4 self-start md:mb-0 md:self-auto md:absolute sm:top-4 sm:left-20 lg:top-4 xl:top-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <img src="/assets/bglogo.png" alt="" aria-hidden="true" className="absolute z-0" />
      <div>
        {showContact ? (
          <Contact onSuccess={() => setShowContact(false)} />
        ) : (
          <LogIn onContactClick={() => setShowContact(true)} />
        )}
      </div>
    </div>
  );
}