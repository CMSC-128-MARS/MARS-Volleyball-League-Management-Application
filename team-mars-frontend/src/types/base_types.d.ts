export interface Admin {
  admin_id: string;
  cognito_sub: string;
  username: string;
  email: string;
  role: string;
  created_at: string; // timestamp with time zone (ISO 8601 string)
}

export interface League {
  league_id: string;
  league_name: string;
  start_date: string; // timestamp with time zone (ISO 8601 string)
  end_date: string | null;
  location: string;
  description: string | null;
}

export interface Team {
  team_id: string; // uuid
  team_name: string;
  created_at: string; // timestamp with time zone (ISO 8601 string)
  league_id: string; // uuid (foreign key)
}

export interface Player {
  player_id: string; // uuid
  first_name: string;
  last_name: string | null;
  jersey_number: number | null;
  default_position: string | null;
  created_at: string; // timestamp with time zone (ISO 8601 string)
}

export interface SkillLevel {
  skill_level_id: string; // uuid
  level: number;
  level_description: string | null;
}

export interface PlayerSkill {
  player_skill_id: string; // uuid
  date_assigned: string; // timestamp with time zone (ISO 8601 string)
  notes: string | null;
  player_id: string; // uuid (foreign key)
  skill_level_id: string; // uuid (foreign key)
  evaluated_by: string; // uuid (foreign key to admin)
}

export interface TeamPlayer {
  team_player_id: string; // uuid
  join_date: string; // timestamp with time zone (ISO 8601 string)
  leave_date: string | null; // (should be null for active players)
  position: string | null;
  team_id: string; // uuid (foreign key)
  player_id: string; // uuid (foreign key)
}

export interface Match {
  match_id: string; // uuid
  match_date: string; // timestamp with time zone (ISO 8601 string)
  location: string;
  created_at: string; // timestamp with time zone (ISO 8601 string)
  league_id: string; // uuid (foreign key)
  team1_id: string; // uuid (foreign key)
  team2_id: string; // uuid (foreign key)
}

export interface MatchTeamStats {
  match_team_stats_id: string; // uuid
  total_score: number | null;
  sets_won: number | null;
  sets_lost: number | null;
  is_winner: boolean | null;
  match_id: string; // uuid (foreign key)
  team_id: string; // uuid (foreign key)
}
