import TeamManagementCard from '@/components/common/team-management-card';
import TeamViewButtons from '@/components/navigation/team-view-buttons';
import TeamDetailsComponent from '@/components/common/team-details';

export default function TeamDetails() {
  const handleBack = () => {
    // TODO: Implement back navigation
  };

  const handleNext = () => {
    // TODO: Implement next navigation
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
      <TeamViewButtons onBack={handleBack} onNext={handleNext} />
      <TeamManagementCard />
      <TeamDetailsComponent teamName="Team A" leagueName="League 1" teamId="123" />
    </div>
  );
}
