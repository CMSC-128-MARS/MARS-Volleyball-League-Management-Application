import { useState, useEffect } from 'react';

/**
  Fetches dashboard statistics from the API
  @returns {stats, isLoading, error}
 */

interface DashboardStats {
  players: number | null;
  teams: number | null;
  events: number | null;
  trophies: number | null;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    players: null,
    teams: null,
    events: null,
    trophies: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard-stats'); // Put API endpoint here
        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        setStats({
          players: data.players || 0,
          teams: data.teams || 0,
          events: data.events || 0,
          trophies: data.trophies || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Dashboard stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};
