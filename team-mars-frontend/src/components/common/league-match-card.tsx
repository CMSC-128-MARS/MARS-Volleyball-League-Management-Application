import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Pencil, Trash} from 'lucide-react';
import { matchStatsApiService } from '@/lib/match-stats';
import type { MatchTeamStatsFull } from '@/lib/match-stats';

type MatchCardProps = {
  matchId: string;
  matchDate: string;
  location?: string;
  team1Name: string;
  team2Name: string;
  team1SetsWon?: number;
  team2SetsWon?: number;
  team1SetsLost?: number;
  team2SetsLost?: number;
  team1TotalScore?: number;
  team2TotalScore?: number;
  team1IsWinner?: boolean;
  team2IsWinner?: boolean;
  num_of_sets?: number;
  isCompleted?: boolean;
  isEditing?: boolean;
  onEdit?: (matchId: string) => void;
  onDelete?: (matchId: string) => void;
};

export default function LeagueMatchCard({
  matchId,
  matchDate,
  location,
  team1Name,
  team2Name,
  team1SetsWon,
  team2SetsWon,
  team1TotalScore,
  team2TotalScore,
  team1IsWinner,
  team2IsWinner,
  num_of_sets = 3,
  isCompleted = false,
  isEditing = false,
  onEdit,
  onDelete,
}: MatchCardProps) {
  // State for live stats
  const [stats, setStats] = useState<MatchTeamStatsFull[] | null>(null);

  useEffect(() => {
    if (!isCompleted) return;
    matchStatsApiService.getMatchTeamStatsByMatch(matchId)
      .then((data) => setStats(data));
  }, [isCompleted, matchId]);

  // Helper to get stat for a team name
  const getStatByTeam = (teamName: string | undefined) =>
    stats?.find((s) => s.team?.team_name === teamName);

  // Use fetched stats if available, otherwise fallback to props
  const t1Stats = isCompleted && stats ? getStatByTeam(team1Name) : undefined;
  const t2Stats = isCompleted && stats ? getStatByTeam(team2Name) : undefined;
  const t1SetsWon = t1Stats?.sets_won ?? team1SetsWon;
  const t2SetsWon = t2Stats?.sets_won ?? team2SetsWon;
  const t1TotalScore = t1Stats?.total_score ?? team1TotalScore;
  const t2TotalScore = t2Stats?.total_score ?? team2TotalScore;
  const t1IsWinner = t1Stats?.is_winner ?? team1IsWinner;
  const t2IsWinner = t2Stats?.is_winner ?? team2IsWinner;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="p-[24px] shadow-md border-2 border-border gap-4 justify-between">
      {/* Top Row */}
      <div className="flex justify-between items-start">
          <Badge
            className="text-white rounded-[2px] px-[8px] py-[4px] h-full"
            style={{
              backgroundColor: isCompleted ? 'var(--primary)' : 'var(--secondary-alt)',
            }}
          >
            {formatDate(matchDate)}
          </Badge>
        {/* Edit/Delete Buttons */}
        {isEditing && (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="default"
              className="h-8 w-8 rounded-[2px] hover:bg-primary hover:opacity-80 cursor-pointer"
              onClick={() => onEdit?.(matchId)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 rounded-[2px] hover:bg-red-600 hover:opacity-80 cursor-pointer"
              onClick={() => onDelete?.(matchId)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Sets and Location Info for Upcoming Matches */}
        {!isCompleted && (
          <div className="flex items-center gap-1 text-muted-foreground justify-between pg2 w-full">
            {location && (
              <div className="flex justify-end items-center gap-[4px] text-muted-foreground pg2">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
              <p className="pg2 text-muted-foreground">
                <span className="pg1-bold text-black">{num_of_sets}</span> set
                {num_of_sets !== 1 ? 's' : ''}
              </p>
          </div>
        )}

      {/* Main Content */}
      <div className="grid grid-cols-1 justify-between items-start gap-2">
      {isCompleted && location && (
        <div className="flex items-center gap-1 text-muted-foreground pg2 w-full">
          <MapPin className="h-4 w-4" />
            <span className='text-center'>{location}</span>
        </div>
      )}
      
        {/* Teams and Scores */}
        <div className={`space-y-0 flex flex-col ${isCompleted ? 'w-full' : ''}`}>
          {/* Team 1 */}
          <div
            className={`flex justify-between items-center py-2 transition-all duration-300 ${isCompleted ? 'w-full' : 'w-auto max-w-[320px]'} mx-auto`}
          >
            <p className={`pg1-bold ${t1IsWinner === true && isCompleted ? 'text-secondary-alt' : ''}`}>
              {team1Name}
            </p>
            {isCompleted && (
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center">
                  <span className={`pg1-bold ${t1IsWinner === true ? 'text-secondary-alt' : ''}`}>{t1SetsWon ?? 0}</span>
                  <span className="pg3 text-muted-foreground">Sets Won</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`pg3-bold font-semibold ${t1IsWinner === true ? 'text-secondary-alt' : ''}`}>{t1TotalScore ?? 0}</span>
                  <span className="pg3 text-muted-foreground">Total Pts</span>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          {isCompleted ? (
            <hr className="border-gray-300 w-full" />
          ) : (
            <div className="relative flex items-center justify-center my-1 w-full mx-auto">
              <hr className="flex-grow border-gray-300 border-dashed" />
              <span className="pg3 text-secondary-alt px-2">vs</span>
              <hr className="flex-grow border-gray-300 border-dashed" />
            </div>
          )}

          {/* Team 2 */}
          <div
            className={`flex justify-between items-center py-2 transition-all duration-300 ${isCompleted ? 'w-full' : 'w-auto max-w-[320px]'} mx-auto`}
          >
            <p className={`pg1-bold ${t2IsWinner === true && isCompleted ? 'text-secondary-alt' : ''}`}>
              {team2Name}
            </p>
            {isCompleted && (
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center">
                  <span className={`pg1-bold  ${t2IsWinner === true ? 'text-secondary-alt' : ''}`}>{t2SetsWon ?? 0}</span>
                  <span className="pg3 text-muted-foreground">Sets Won</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`pg3-bold font-semibold ${t2IsWinner === true ? 'text-secondary-alt' : ''}`}>{t2TotalScore ?? 0}</span>
                  <span className="pg3 text-muted-foreground">Total Pts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </Card>
  );
}
