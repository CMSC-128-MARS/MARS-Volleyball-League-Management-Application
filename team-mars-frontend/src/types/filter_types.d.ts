// ============================================================================
// Filter/Query Types
// ============================================================================

export interface PlayerFilters extends PaginationParams {
  search?: string;
  skill_level?: number;
  team_id?: string;
}

export interface MatchFilters extends PaginationParams {
  league_id?: string;
  team_id?: string;
  from_date?: string;
  to_date?: string;
  completed?: boolean;
}

export interface TeamFilters extends PaginationParams {
  league_id?: string;
}

export interface LeagueFilters extends PaginationParams {
  status?: LeagueStatus;
  location?: string;
}
