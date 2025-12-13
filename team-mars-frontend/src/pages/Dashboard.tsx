import { RecentMatchesCard } from '@/components/common/recent-matches-card';
import { LeagueOverviewCard } from '@/components/common/leagues-overview-card';

const Dashboard = () => {
  return (
    <div
      className="bg-background text-primary-foreground relative overflow-auto h-full"
      style={{
        backgroundImage: `url('/assets/Grunge.png')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      <main className="px-0 md:px-[40px] xl:px-[80px] py-[32px] bg-transparent space-y-[24px]">
        {/* Removed Stats Cards Section */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          {/* Recent Matches */}
          <section>
            <RecentMatchesCard />
          </section>

          {/* League Overview */}
          <section>
            <LeagueOverviewCard />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
