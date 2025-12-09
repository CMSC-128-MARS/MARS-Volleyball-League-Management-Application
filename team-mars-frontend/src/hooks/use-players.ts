import { useEffect, useState, useCallback } from 'react';
import { fetchPlayers } from '@/lib/api';
import type { Player as PlayerUI } from '@/lib/players';

export const usePlayers = () => {
  const [players, setPlayers] = useState<PlayerUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiPlayers = await fetchPlayers();
      setPlayers(apiPlayers as unknown as PlayerUI[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load players';
      setError(message);
      console.error('Error loading players:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  return {
    players,
    isLoading,
    error,
    refetch: loadPlayers,
  };
};
