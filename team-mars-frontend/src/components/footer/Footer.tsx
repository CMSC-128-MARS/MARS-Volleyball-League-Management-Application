import { Button } from '@/components/ui/Buttons';
import { Headset } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-background-alt text-primary-foreground relative">
      <div className="footer-border">
        <div className="border-[2px] border-secondary">
          <div className="footer-padding-responsive">
            <div className="footer-logo-responsive">
              <img
                src="./src/assets/logo.png"
                alt="MARS Logo"
                className="w-[60px] h-[60px] object-contain"
              />
              <img
                src="./src/assets/MARS-logo.png"
                alt="MARS Logo"
                className="w-[200px] h-[60px] object-contain"
              />
            </div>
            <div className="footer-contact-responsive">
              <Button variant="outline" size="sm" className="color-white">
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
