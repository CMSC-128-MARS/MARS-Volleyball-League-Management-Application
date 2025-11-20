import { Button } from "@/components/ui/Buttons"

const LandingPage = () => {
  return (
  /* Hero section */
  <div className="bg-background-alt text-primary-foreground relative overflow-hidden" style={{
    backgroundImage: `url('./src/assets/Dust.png')`,
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat'
  }}>
    {/* Bg Elements*/}
    <img 
      src="./src/assets/hero-element1.png" 
      alt="Hero Element 1"
      className="hero-bg-element-base hero-bg-element-bottom-right absolute"
    />
    <img 
      src="./src/assets/hero-element2.png" 
      alt="Hero Element 2"  
      className="hero-bg-element-base hero-bg-element-bottom-left absolute"
    />
    
    {/* Main */}
    <div className="relative z-10 flex flex-col items-center justify-center margin-lr-responsive gap-[32px]">
      {/* Logo and subheading */}
      <div className="mt-[148px] flex flex-col items-center gap-[8px]">
        <img 
        src="./src/assets/MARS-logo.png" 
        alt="MARS Logo"
        className="logo-responsive object-contain"/>
        <h2 className="heading-responsive uppercase">Volleyball League Management System</h2>
      </div>
      {/* Buttons */}
      <div className="flex gap-4 items-center mb-[148px]">
        <Button variant="secondary" size="lg" className="text-primary uppercase">
        Sign In
        </Button>
      </div>
    </div>
  </div>
  );
};

export default LandingPage;
