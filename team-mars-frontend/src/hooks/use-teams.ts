import { useState, useEffect, useCallback } from 'react';
import { fetchTeams, type ApiTeam } from '@/lib/api';

type UseTeamsOptions = {
  limit?: number;
  leagueId?: string;
};

/**
 * Fetches teams data from the backend API.
 * @returns {teams, isLoading, error, formatDate, refetch}
 */

export const useTeams = ({ limit = 6, leagueId }: UseTeamsOptions = {}) => {
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiTeams = await fetchTeams({ limit, league_id: leagueId });
      const getTimestamp = (value?: string) => {
        if (!value) return 0;
        const timestamp = Date.parse(value);
        return Number.isNaN(timestamp) ? 0 : timestamp;
      };

      const sortedTeams = apiTeams
        .slice()
        .sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at))
        .slice(0, limit);
      setTeams(sortedTeams);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Teams fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit, leagueId]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Format date to readable format
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) {
      return '—';
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return {
    teams,
    isLoading,
    error,
    formatDate,
    refetch: loadTeams,
  };
};
