import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { authSignOut } from '@/lib/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';

const Navbar2 = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const logout = useAuthStore((s) => s.logout);
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <>
      <nav className="bg-primary w-full">
        <div className="flex flex-row items-center justify-between px-[20px] md:px-[80px] py-[12px]">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <button onClick={toggleSidebar} className="cursor-pointer" aria-label="Toggle sidebar">
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
          <div className="">


            <button
              onClick={async () => {
                try {
                  setIsSigningOut(true);
                  const res = await authSignOut();
                  if (res?.success) {
                    console.log('Sign out successful');
                  }
                } catch (err) {
                  console.error('Sign out failed', err);
                } finally {
                  // Clear local auth state and redirect to login
                  logout();
                  console.log('Local auth state cleared (logged out)');
                  setIsSigningOut(false);
                  navigate('/login');
                }
              }}
              aria-label="Sign out"
              className="h-9 w-9"
              title="Sign out"
            >
              <LogOut
                className="text-white border border-white -ml-4 p-2 w-9 h-9 rounded-sm hover:cursor-pointer bg-[rgba(255,255,255,0.10)] "
                aria-hidden={isSigningOut}
              />
            </button>
          </div>
        </div>
      </nav>

      <hr className="bg-secondary w-full h-1 border-0" />
    </>
  );
};

export default Navbar2;
