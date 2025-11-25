import { useState } from 'react';
import LogIn from '../components/forms/login';
import Contact from '../components/forms/contact';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="relative h-full w-full bg-primary flex flex-col justify-center items-center">
      {showContact && (
        <button
          onClick={() => setShowContact(false)}
          className="text-secondary mt-[41px] ml-[81px] absolute top-4 left-4 z-10 flex flex-row items-center justify-center gap-2 min-h-9 px-4 py-[7.5px] rounded-[2px] border-2 border-secondary bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <img src="./src/assets/bglogo.png" alt="" className="absolute z-0" />
      <div>{showContact ? <Contact /> : <LogIn onContactClick={() => setShowContact(true)} />}</div>
    </div>
  );
}
