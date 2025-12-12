import { useState, useEffect } from 'react';
import { matchStatsApiService } from '@/lib/match-stats/match-stats.service';
import type { MatchTeamStatsFull } from '@/lib/match-stats/match-stats.types';

interface Match {
  id: string;
  date: string;
  time: string;
  league: string;
  team1: {
    id: string;
    name: string;
    score: number;
  };
  team2: {
    id: string;
    name: string;
    score: number;
  };
  sets: Array<{
    team1Score: number;
    team2Score: number;
  }>;
  status: 'Final';
}

export const useRecentMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all match team stats
        const allStats = await matchStatsApiService.listMatchTeamStats(0, 20);
        
        // Group stats by match_id
        const matchesMap = new Map<string, MatchTeamStatsFull[]>();
        
        allStats.forEach(stat => {
          if (stat.match?.match_id) {
            const existing = matchesMap.get(stat.match.match_id) || [];
            matchesMap.set(stat.match.match_id, [...existing, stat]);
          }
        });

        // Convert to Match format
        const formattedMatches: Match[] = Array.from(matchesMap.entries())
          .filter(([_, stats]) => stats.length === 2) // Only complete matches with 2 teams
          .map(([matchId, stats]) => {
            const match = stats[0].match!;
            
            // Find team1 and team2 stats
            const team1Stats = stats.find(s => s.team?.team_id === match.team1_id);
            const team2Stats = stats.find(s => s.team?.team_id === match.team2_id);

            if (!team1Stats || !team2Stats) {
              return null;
            }

            // Parse date and time
            const matchDate = new Date(match.match_date);
            const timeString = matchDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });

            // Create placeholder sets based on sets won/lost
            const totalSets = (team1Stats.sets_won || 0) + (team1Stats.sets_lost || 0);
            const sets: Array<{ team1Score: number; team2Score: number }> = [];
            
            // Generate placeholder set scores
            for (let i = 0; i < totalSets; i++) {
              sets.push({
                team1Score: i < (team1Stats.sets_won || 0) ? 25 : 20,
                team2Score: i < (team1Stats.sets_won || 0) ? 20 : 25,
              });
            }

            return {
              id: matchId,
              date: match.match_date,
              time: timeString,
              league: match.location || 'Unknown League',
              team1: {
                id: team1Stats.team!.team_id,
                name: team1Stats.team!.team_name,
                score: team1Stats.sets_won || 0,
              },
              team2: {
                id: team2Stats.team!.team_id,
                name: team2Stats.team!.team_name,
                score: team2Stats.sets_won || 0,
              },
              sets,
              status: 'Final' as const,
            };
          })
          .filter((match): match is Match => match !== null)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setMatches(formattedMatches);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
        console.error('Recent matches error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formattedMatches = matches.map((match) => ({
    ...match,
    formattedDate: formatDate(match.date),
    displayText: `${formatDate(match.date)} | ${match.time}`,
  }));

  return { matches: formattedMatches, isLoading, error };
};