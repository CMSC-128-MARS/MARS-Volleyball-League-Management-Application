import { useEffect, useState, useCallback } from 'react';
import { fetchLeagues, type ApiLeague } from '@/lib/api';

interface UseLeaguesOptions {
  limit?: number;
}

export const useLeagues = ({ limit = 100 }: UseLeaguesOptions = {}) => {
  const [leagues, setLeagues] = useState<ApiLeague[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeagues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiLeagues = await fetchLeagues({ limit });
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

  return {
    leagues,
    isLoading,
    error,
    refetch: loadLeagues,
  };
};
