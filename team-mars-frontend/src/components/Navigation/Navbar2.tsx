import { Menu } from 'lucide-react';

const Navbar2 = () => {
  return (
    <>
      <nav className="bg-primary w-full">
        <div className="flex items-center gap-2 px-[80px] py-[12px]">
          <Menu className="text-white border border-white rounded-md p-2 w-9 h-9" />

          <div className="flex flex-row items-center">
            <img src="./src/assets/MARS-logo.png" alt="MARS Logo" className="h-[45px]" />

            <div className="font-paragraph text-white text-sm leading-tight text-left ml-[-6px]">
              <p>VOLLEYBALL LEAGUE</p>
              <p>MANAGEMENT SYSTEM</p>
            </div>
          </div>
        </div>
      </nav>

      <hr className="bg-secondary w-full h-1 border-0" />
    </>
  );
};

export default Navbar2;
