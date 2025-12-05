import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';
import TeamNavigationButtons from '@/components/common/team-navigation-buttons';
import { useNavigate } from 'react-router-dom';

export default function AddTeamCard() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/teams');
  };

  const handleNext = () => {
    // TODO: Implement team creation logic
    console.log('Create team');
  };

  return (
    <div
      className="items-center p-5 md:p-5 lg:p-20 justify-center w-full min-h-[calc(100vh-5rem)]"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="mb-9">
        <TeamNavigationButtons onBack={handleBack} onNext={handleNext} />
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <AddTeamDetails />
        <CreateRoster />
      </div>
    </div>
  );
}
