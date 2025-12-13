import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentMatches } from '@/hooks/use-recentMatches';
import { MapPin } from 'lucide-react';

export const RecentMatchesCard = () => {
  const { matches, isLoading, error } = useRecentMatches();

  if (isLoading) {
    return (
      <Card className="w-full border border-border shadow-md">
        <CardContent className="px-6 space-y-6 mb-6">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[120px] w-full rounded-md" />
            <Skeleton className="h-[120px] w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border border-border shadow-md">
        <CardContent className="px-6 text-center text-red-500 mb-6">
          Error loading matches: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-border shadow-md">
      
      {/* --- Header Section --- */}
      
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-400">
        <div>
          <h4 className="text-foreground text-xl">Recent Matches</h4>
        </div>
        <span className="text-muted-foreground text-sm font-medium">
          Total: {Math.min(matches.length, 3)}
        </span>
      </div>

      <CardContent className="px-6 mb-6">
        {/* --- Match List --- */}
        <div className="space-y-4">
          {matches.slice(0, 3).map((match) => {
            // 1. Determine Winner
            const isTeam1Winner = match.team1.score > match.team2.score;
            const isTeam2Winner = match.team2.score > match.team1.score;

            // 2. Calculate Total Points from Backend Data
            const team1TotalPoints = match.sets.reduce((sum, set) => sum + set.team1Score, 0);
            const team2TotalPoints = match.sets.reduce((sum, set) => sum + set.team2Score, 0);

            return (
              <div 
                key={match.id} 
                className="w-full bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all "
              >
                  
                {/* Match Header */}
                <div className="flex justify-between items-start mb-4 ">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-sm">
                    {new Date(match.formattedDate).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm ">
                    <MapPin className="w-4 h-4" />
                    <span>{match.league}</span>
                  </div>
                </div>

                {/* Teams Grid */}
                <div className="space-y-3">
                  
                  {/* Team 1 Row */}
                  <div className="grid grid-cols-12 items-center pb-3 border-b border-gray-100/80">
                    <div className={`col-span-4 pg1 ${isTeam1Winner ? 'text-secondary-alt font-bold' : 'text-foreground'}`}>
                      {match.team1.name}
                    </div>

                    <div className="col-span-4 flex flex-col items-center justify-center">
                      <span className={`pg1 ${isTeam1Winner ? 'text-secondary-alt font-bold' : 'text-foreground'}`}>
                        {match.team1.score} 
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 text-center">Sets Won</span>
                    </div>

                    <div className="col-span-4 flex flex-col items-end justify-center">
                      <span className={`pg1 ${isTeam1Winner ? 'text-secondary-alt font-bold' : 'text-foreground'}`}>
                        {team1TotalPoints}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Pts</span>
                    </div>
                  </div>

                  {/* Team 2 Row */}
                  <div className="grid grid-cols-12 items-center">
                    <div className={`col-span-4 pg1 ${isTeam2Winner ? 'text-secondary-alt font-bold' : 'text-foreground'}`}>
                      {match.team2.name}
                    </div>
                    
                    <div className="col-span-4 flex flex-col items-center justify-center">
                      <span className={`pg1 ${isTeam2Winner ? 'text-secondary-alt font-bold' : 'text-foreground'}`}>
                        {match.team2.score}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 text-center">Sets Won</span>
                    </div>

                    <div className="col-span-4 flex flex-col items-end justify-center">
                      <span className={`pg1 ${isTeam2Winner ? 'text-secondary-alt font-bold' : 'text-foreground'}`}>
                          {team2TotalPoints}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Pts</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};