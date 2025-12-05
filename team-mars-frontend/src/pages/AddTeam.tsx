import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';
import TeamNavigationButtons from '@/components/common/team-navigation-buttons';
import SelectedPlayersCard from '@/components/common/selected-players-card';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AddTeamCard() {
  const navigate = useNavigate();
  const [rosterCreated, setRosterCreated] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'automatic' | null>(null);

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
        <TeamNavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          isDisabled={!rosterCreated}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <AddTeamDetails />
        <CreateRoster
          onRosterMethodSelected={() => setRosterCreated(true)}
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
        />
      </div>
      {selectedMethod === 'manual' && (
        <div className="mt-10 flex-1">
          <SelectedPlayersCard />
        </div>
      )}
    </div>
  );
}
