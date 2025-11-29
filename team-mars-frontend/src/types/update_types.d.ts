// ============================================================================
// Update Types (for PATCH/PUT requests - all fields optional)
// ============================================================================

export interface AdminUpdate {
  username?: string;
  email?: string;
  role?: string;
}

export interface LeagueUpdate {
  league_name?: string;
  start_date?: string;
  end_date?: string | null;
  location?: string;
  description?: string | null;
}

export interface TeamUpdate {
  team_name?: string;
  league_id?: string;
}

export interface PlayerUpdate {
  first_name?: string;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
}

export interface SkillLevelUpdate {
  level?: number;
  level_description?: string | null;
}

export interface PlayerSkillUpdate {
  skill_level_id?: string;
  evaluated_by?: string;
  notes?: string | null;
}

export interface TeamPlayerUpdate {
  leave_date?: string | null;
  position?: string | null;
}

export interface MatchUpdate {
  match_date?: string;
  location?: string;
  league_id?: string;
}

export interface MatchTeamStatsUpdate {
  total_score?: number | null;
  sets_won?: number | null;
  sets_lost?: number | null;
  is_winner?: boolean | null;
}
