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
    <Card className="p-[24px] shadow-md border border-border">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Badge
            className="text-white rounded-[2px] px-[8px] py-[4px]"
            style={{
              backgroundColor: isCompleted ? 'var(--primary)' : 'var(--secondary-alt)',
            }}
          >
            {formatDate(matchDate)}
          </Badge>
          {isCompleted && location && (
            <div className="flex items-center gap-1 text-muted-foreground pg2">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          )}
        </div>

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

      {/* Main Content */}
      <div className="flex justify-between items-start gap-6">
        {/* Teams and Scores */}
        <div className={`space-y-0 flex flex-col ${isCompleted ? 'w-full' : ''}`}>
          {/* Team 1 */}
          <div className="flex justify-between items-center py-2">
            <p className={`pg1-bold ${t1IsWinner === true && isCompleted ? 'text-secondary-alt' : ''}`}>
              {team1Name}
            </p>
            {isCompleted && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className={`text-2xl font-bold ${t1IsWinner === true ? 'text-secondary-alt' : ''}`}>{t1SetsWon ?? 0}</span>
                  <span className="text-xs text-muted-foreground">Sets Won</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-lg font-semibold ${t1IsWinner === true ? 'text-secondary-alt' : ''}`}>{t1TotalScore ?? 0}</span>
                  <span className="text-xs text-muted-foreground">Total Pts</span>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-300" />

          {/* Team 2 */}
          <div className="flex justify-between items-center py-2">
            <p className={`pg1-bold ${t2IsWinner === true && isCompleted ? 'text-secondary-alt' : ''}`}>
              {team2Name}
            </p>
            {isCompleted && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className={`text-2xl font-bold ${t2IsWinner === true ? 'text-secondary-alt' : ''}`}>{t2SetsWon ?? 0}</span>
                  <span className="text-xs text-muted-foreground">Sets Won</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-lg font-semibold ${t2IsWinner === true ? 'text-secondary-alt' : ''}`}>{t2TotalScore ?? 0}</span>
                  <span className="text-xs text-muted-foreground">Total Pts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sets and Location Info for Upcoming Matches */}
        {!isCompleted && (
          <div className="flex flex-col gap-2 text-right h-full justify-center">
            <div>
              <p className="pg2 text-muted-foreground">
                <span className="font-bold text-black">{num_of_sets}</span> set
                {num_of_sets !== 1 ? 's' : ''}
              </p>
            </div>
            {location && (
              <div className="flex items-center justify-end gap-1 text-muted-foreground pg2">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
