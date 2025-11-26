import { Button } from '@/components/ui/Buttons';
import { Users2 } from 'lucide-react';
import { Volleyball } from 'lucide-react';
import { Trophy } from 'lucide-react';
import Footer from '@/components/footer/Footer';

const LandingPage = () => {
  return (
    <>
      {/* Hero section */}
      <div
        className="bg-background-alt text-primary-foreground relative overflow-hidden"
        style={{
          backgroundImage: `url('/Dust.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Bg Elements*/}
        <img
          src="/assets/hero-element1.png"
          alt="Hero Element 1"
          className="hero-bg-element-base hero-bg-element-bottom-right absolute"
        />
        <img
          src="/assets/hero-element2.png"
          alt="Hero Element 2"
          className="hero-bg-element-base hero-bg-element-bottom-left absolute"
        />
        {/* Main */}
        <div className="hero-padding-responsive">
          {/* Logo and subheading */}
          <div className="flex flex-col items-center gap-[8px]">
            <img
              src="/assets/MARS-logo.png"
              alt="MARS Logo"
              className="w-auto h-auto object-contain"
            />
            <h2 className="heading-hero-responsive uppercase text-center">
              Volleyball League Management System
            </h2>
          </div>
          {/* Buttons */}
          <div className="flex items-center">
            <Button variant="secondary" size="lg" className="text-primary uppercase ">
              Sign In
            </Button>
          </div>
        </div>
      </div>
      {/* Features section */}
      <div
        className="bg-background-alt-2 relative"
        style={{
          backgroundImage: `url('/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Main*/}
        <div className="features-main-responsive">
          {/* Heading */}
          <h1 className="features-heading-responsive text-primary-foreground">
            <span className="text-secondary">League</span> Management Made Easy.
          </h1>
          {/* Content */}
          <div className="features-content-responsive">
            <div className="features-card-responsive">
              <Users2 className="text-secondary w-[40px] h-[40px]" />
              <h3 className="text-left text-secondary py-[8px]">Efficient Player Management</h3>
              <div className="w-full h-[2px] bg-secondary" />
              <p className="features-paragraph-responsive text-left text-primary-foreground pt-[8px]">
                Go beyond basic details with our optimized Player Management feature. This system
                allows you to effortlessly record, update, and track all necessary player
                information.
              </p>
            </div>
            <div className="features-card-responsive">
              <Volleyball className="text-secondary w-[40px] h-[40px]" />
              <h3 className="text-left text-secondary py-[8px]">Simplified Team Organization</h3>
              <div className="w-full h-[2px] bg-secondary rounded" />
              <p className="features-paragraph-responsive text-left text-primary-foreground pt-[8px]">
                A comprehensive system that significantly simplifies the organization of all teams
                by providing a straightforward interface for assigning players, managing team
                details, and handling administrative updates.
              </p>
            </div>
            <div className="features-card-responsive">
              <Trophy className="text-secondary w-[40px] h-[40px]" />
              <h3 className="text-left text-secondary py-[8px]">Effortless League Creation</h3>
              <div className="w-full h-[2px] bg-secondary rounded" />
              <p className="features-paragraph-responsive text-left text-primary-foreground pt-[8px]">
                Experience a seamless process for creating and managing leagues with our
                user-friendly tools designed to simplify every step from setup to completion.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
