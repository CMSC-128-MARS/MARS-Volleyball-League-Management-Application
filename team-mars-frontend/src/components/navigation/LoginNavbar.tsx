import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <nav className="bg-primary w-full p-4 flex flex-col justify-center items-center gap-4">
        <Link to="/">
          <img src="/assets/logo.png" alt="Logo" className="w-[60px] h-[60px]" />{' '}
        </Link>
      </nav>
      <hr className="bg-secondary w-full h-1 border-0" />
    </>
  );
};

export default Navbar;
