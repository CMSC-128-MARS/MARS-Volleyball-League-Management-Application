import { useState, useEffect } from 'react';
import { teamApiService } from '@/lib/team';
import type { TeamWithCounts } from '@/lib/team/team.types';

export function useTeam(teamId: string | null) {
  const [team, setTeam] = useState<TeamWithCounts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      return;
    }

    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await teamApiService.getTeamById(teamId);
        setTeam(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team';
        setError(errorMessage);
        console.error('Failed to fetch team:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  const refetch = async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await teamApiService.getTeamById(teamId);
      setTeam(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team';
      setError(errorMessage);
      console.error('Failed to fetch team:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { team, isLoading, error, refetch };
}
