import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';

const Navbar2 = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <nav className="bg-primary w-full">
        <div className="flex flex-row items-center justify-between px-[20px] md:px-[80px] py-[12px]">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <button onClick={toggleSidebar} className=" cursor-pointer" aria-label="Toggle sidebar">
              <Menu className="text-white border border-white p-2 w-9 h-9 rounded-sm bg-[rgba(255,255,255,0.10)]" />
            </button>

            {/* Logo + Text */}
            <div
              onClick={() => navigate('/')}
              className="flex flex-row items-center cursor-pointer"
            >
              {/* Logo - hidden on sm, shown on md+ */}
              <img
                src="/assets/MARS-logo.png"
                alt="MARS Logo"
                className="h-[45px] hidden md:block"
              />

              {/* Text - only shown on lg+ */}
              <div className="hidden lg:block font-paragraph text-white text-sm leading-tight text-left -ml-1.5">
                <p>VOLLEYBALL LEAGUE</p>
                <p>MANAGEMENT SYSTEM</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-row items-center gap-6 md:gap-20 rounded-[2px] bg-[rgba(255,255,255,0.10)] px-4 py-2">
            <div className="flex flex-row items-center">
              <p className="border-secondary bg-primary border-2 rounded-[8px] w-8 h-8 justify-center flex items-center text-secondary">
                A
              </p>

              <div className="text-white leading-tight font-paragraph text-left mx-2 md:mx-4">
                <p className="text-sm">Admin</p>
                <p className="text-xs">#12345</p>
              </div>
            </div>

            <LogOut className="text-white border border-white p-2 w-9 h-9 rounded-sm" />
          </div>
        </div>
      </nav>

      <hr className="bg-secondary w-full h-1 border-0" />
    </>
  );
};

export default Navbar2;
