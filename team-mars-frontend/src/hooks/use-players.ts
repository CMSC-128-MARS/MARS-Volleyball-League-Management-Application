import { useEffect, useState } from 'react';
import { fetchPlayers, type ApiPlayer } from '@/lib/api';

interface UsePlayersOptions {
  limit?: number;
}

export const usePlayers = ({ limit = 100 }: UsePlayersOptions = {}) => {
  const [players, setPlayers] = useState<ApiPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiPlayers = await fetchPlayers({ limit });
      setPlayers(apiPlayers);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load players';
      setError(message);
      console.error('Error loading players:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, [limit]);

  return {
    players,
    isLoading,
    error,
    refetch: loadPlayers,
  };
};
