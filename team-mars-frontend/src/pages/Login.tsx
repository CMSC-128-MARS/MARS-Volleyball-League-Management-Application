import { useState } from 'react';
import LogIn from '../components/forms/login';
import Contact from '../components/forms/contact';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="relative h-full w-full bg-primary flex flex-col justify-center items-center px-4 md:px-0">
      {showContact && (
        <button
          onClick={() => setShowContact(false)}
          className="text-secondary hover:cursor-pointer z-10 flex flex-row items-center justify-start gap-2 min-h-9 px-4 py-[7.5px] rounded-[2px] border-2 border-secondary bg-transparent mb-4 self-start lg:mb-0 lg:self-auto lg:absolute lg:top-[41px] lg:left-[81px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <img src="/assets/bglogo.png" alt="" className="absolute z-0" />
      <div>{showContact ? <Contact /> : <LogIn onContactClick={() => setShowContact(true)} />}</div>
    </div>
  );
}
