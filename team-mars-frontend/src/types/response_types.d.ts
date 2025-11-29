// ============================================================================
// Response Types (for API responses with computed fields)
// ============================================================================

export interface LeagueResponse extends League {
  status: 'upcoming' | 'active' | 'completed';
  is_active: boolean;
  team_count?: number;
  match_count?: number;
}

export interface MatchResponse extends Match {
  matchup: string;
  is_completed: boolean;
  winner?: Team;
  score_summary?: string;
}

export interface TeamStatsResponse {
  team_id: string;
  team_name: string;
  wins: number;
  losses: number;
  win_rate: number;
  sets_won: number;
  sets_lost: number;
  set_differential: number;
  total_score: number;
}

export interface LeagueStandingsResponse {
  league_id: string;
  league_name: string;
  standings: TeamStandingItem[];
}

export interface TeamStandingItem {
  rank: number;
  team_id: string;
  team_name: string;
  wins: number;
  losses: number;
  win_rate: number;
  sets_won: number;
  sets_lost: number;
  set_differential: number;
  total_score: number;
}
