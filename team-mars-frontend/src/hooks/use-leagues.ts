import { useEffect, useState, useCallback } from 'react';
import { leagueApiService, type League } from '@/lib/league';

interface UseLeaguesOptions {
  limit?: number;
}

export const useLeagues = ({ limit }: UseLeaguesOptions = {}) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeagues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiLeagues = await leagueApiService.fetchLeagues({ limit });
      setLeagues(apiLeagues);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leagues';
      setError(message);
      console.error('Error loading leagues:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadLeagues();
  }, [loadLeagues]);

  // Format date to readable format
  const formatDate = useCallback((dateString?: string | null) => {
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
    leagues,
    isLoading,
    error,
    formatDate,
    refetch: loadLeagues,
  };
};
