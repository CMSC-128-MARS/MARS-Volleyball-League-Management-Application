import AddTeamDetails from '@/components/common/add-team-details';
import CreateRoster from '@/components/common/create-roster';

export default function AddTeamCard() {
  return (
    <div
      className="items-center md:p-5 lg:p-20 justify-center w-full min-h-[calc(100vh-5rem)]"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className='flex flex-col md:flex-row gap-10 items-center justify-center '>
        <AddTeamDetails />
        <CreateRoster />
      </div>
    </div>
  );
}
