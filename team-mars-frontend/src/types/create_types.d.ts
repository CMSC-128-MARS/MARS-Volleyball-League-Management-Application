// ============================================================================
// Create Types (for POST requests - no IDs or timestamps)
// ============================================================================

export interface AdminCreate {
  cognito_sub: string;
  username: string;
  email: string;
  role: string;
}

export interface LeagueCreate {
  league_name: string;
  start_date: string;
  end_date?: string | null;
  location: string;
  description?: string | null;
}

export interface TeamCreate {
  team_name: string;
  league_id: string;
}

export interface PlayerCreate {
  first_name: string;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
}

export interface SkillLevelCreate {
  level: number;
  level_description?: string | null;
}

export interface PlayerSkillCreate {
  player_id: string;
  skill_level_id: string;
  evaluated_by: string;
  date_assigned?: string;
  notes?: string | null;
}

export interface TeamPlayerCreate {
  team_id: string;
  player_id: string;
  join_date?: string;
  position?: string | null;
}

export interface MatchCreate {
  league_id: string;
  team1_id: string;
  team2_id: string;
  match_date: string;
  location: string;
}

export interface MatchTeamStatsCreate {
  match_id: string;
  team_id: string;
  total_score?: number | null;
  sets_won?: number | null;
  sets_lost?: number | null;
  is_winner?: boolean | null;
}
