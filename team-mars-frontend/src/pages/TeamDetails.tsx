import TeamManagementCard from '@/components/common/team-management-card';
import TeamViewButtons from '@/components/navigation/team-view-buttons';
import TeamDetailsComponent from '@/components/common/team-details';
import ViewTeamPlayersCard from '@/components/common/view-team-players-card';

export default function TeamDetails() {
  const handleBack = () => {
    // TODO: Implement back navigation
  };

  const handleNext = () => {
    // TODO: Implement next navigation
  };

  return (
    <div
      className="flex flex-col gap-6 items-center p-5 md:p-5 lg:p-20 justify-start w-full min-h-[calc(100vh-5rem)]"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <TeamViewButtons onBack={handleBack} onNext={handleNext} />
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex flex-col gap-6 lg:w-1/3">
          <TeamManagementCard />
          <TeamDetailsComponent teamName="Team A" leagueName="League 1" teamId="123" />
        </div>
        <div className="lg:w-2/3">
          <ViewTeamPlayersCard
            players={[]}
            onRemovePlayer={() => {}}
            onSave={() => {}}
            isSaving={false}
          />
        </div>
      </div>{' '}
    </div>
  );
}
