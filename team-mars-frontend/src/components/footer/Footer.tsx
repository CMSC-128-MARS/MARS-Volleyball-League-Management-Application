import { Button } from '@/components/ui/button';
import { Headset } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-background-alt text-primary-foreground relative">
      <div className="footer-border">
        <div className="border-[2px] border-secondary">
          <div className="footer-padding-responsive">
            <div className="footer-logo-responsive">
              <Link to="/">
                <img
                  src="/assets/logo.png"
                  alt="MARS Logo"
                  className="w-[60px] h-[60px] object-contain"
                />
              </Link>
              <Link to="/">
                <img
                  src="/assets/MARS-logo.png"
                  alt="MARS Logo"
                  className="w-[200px] h-[60px] object-contain"
                />
              </Link>
            </div>
            <div className="footer-contact-responsive">
              <Button variant="icon-slate" size="xs" className="color-white cursor-pointer">
                <Headset className="w-[16px] h-[16px]" />
              </Button>
              <p className="pg3">© 2025 MARS Volleyball League Management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
