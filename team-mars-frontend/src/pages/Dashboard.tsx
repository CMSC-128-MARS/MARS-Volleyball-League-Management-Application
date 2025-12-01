import { StatsCard } from "@/components/ui/stats-card"
import { User2, Users2, Calendar, Trophy} from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboardStats"

const Dashboard = () => {
    const { stats, isLoading, error } = useDashboardStats()

    // Handle error state
    if (error) {
        console.error('Dashboard error:', error)
    }

    return (
        <div className="bg-background text-primary-foreground relative overflow-hidden min-h-screen"
        style={{
          backgroundImage: `url('/assets/Grunge.png')`,
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}>
            <main className="px-0 md:px-[40px] xl:px-[80px] py-[32px] bg-transparent">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="space-y-4">
                    </section>
                    
                    {/* Teams Overview */}
                    <section className="space-y-4">
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;