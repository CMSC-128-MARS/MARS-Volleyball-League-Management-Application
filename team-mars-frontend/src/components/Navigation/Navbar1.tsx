const Navbar = () => {
  return (
    <>
      <nav className="bg-primary w-full p-4 flex flex-col justify-center items-center gap-4">
        <img src="./src/assets/logo.png" alt="Logo" className="w-[60px] h-[60px]" />
      </nav>
      <hr className="bg-secondary w-full h-1 border-0" />
    </>
  );
};

export default Navbar;
