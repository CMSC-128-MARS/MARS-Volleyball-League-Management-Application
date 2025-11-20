import LogIn from '../components/forms/login';

export default function Login() {
  return (
    <div className="relative h-full w-full bg-primary flex flex-col justify-center items-center">
      <img src="./src/assets/bglogo.png" alt="" className="absolute z-0" />
      <div>
        <LogIn />
      </div>
    </div>
  );
}
