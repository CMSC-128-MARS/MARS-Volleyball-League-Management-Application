import { StatsCard } from "@/components/ui/stats-card"
import { User2, Users2, Calendar, Trophy} from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboardStats"
import { RecentMatchesCard } from "@/components/ui/recent-matches-card"

const Dashboard = () => {
    const { stats, isLoading, error } = useDashboardStats()

    if (error) {
        console.error('Dashboard error:', error)
    }

    return (
        <div className="bg-background text-primary-foreground relative overflow-hidden h-full"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}>
            <main className="px-0 md:px-[40px] xl:px-[80px] py-[32px] bg-transparent space-y-[24px]">
                {/* Stats Cards Section */}
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-[12px] md:gap-[16px]">
                        <StatsCard 
                            icon={User2} 
                            value={stats.players} 
                            label="Players added" 
                            isLoading={isLoading}
                        />
                        <StatsCard 
                            icon={Users2} 
                            value={stats.teams} 
                            label="Teams registered" 
                            isLoading={isLoading}
                        />
                        <StatsCard 
                            icon={Calendar} 
                            value={stats.events} 
                            label="Matches recorded" 
                            isLoading={isLoading}
                        />
                        <StatsCard 
                            icon={Trophy} 
                            value={stats.trophies} 
                            label="Leagues created" 
                            isLoading={isLoading}
                        />
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                    {/* Recent Matches */}
                    <section>
                        <RecentMatchesCard />
                    </section>
                    
                    {/* Teams Overview */}
                    <section>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;