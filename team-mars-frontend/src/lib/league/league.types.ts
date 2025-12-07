export type League = {
  league_id: string;
  league_name: string;
  start_date: string;
  end_date?: string | null;
  location: string;
  description?: string | null;
  is_active?: boolean;
  status?: 'upcoming' | 'active' | 'completed';
};

export type LeagueFull = League & {
  teams?: unknown[];
  matches?: unknown[];
  team_count?: number;
  match_count?: number;
};

export type FetchLeaguesParams = {
  limit?: number;
};
