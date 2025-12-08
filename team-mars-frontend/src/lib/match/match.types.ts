export interface Match {
  match_id: string;
  match_date: string;
  location: string;
  league_id: string;
  team1_id: string;
  team2_id: string;
  created_at: string;
}

export interface MatchWithTeams extends Match {
  team1?: {
    team_id: string;
    team_name: string;
  };
  team2?: {
    team_id: string;
    team_name: string;
  };
  league?: {
    league_id: string;
    league_name: string;
  };
}

export interface MatchCreate {
  league_id: string;
  team1_id: string;
  team2_id: string;
  match_date: string;
  location: string;
  num_of_sets: number;
}

export interface MatchUpdate {
  match_date?: string;
  location?: string;
  league_id?: string;
}

export interface MatchFull extends Match {
  team1?: {
    team_id: string;
    team_name: string;
  };
  team2?: {
    team_id: string;
    team_name: string;
  };
  match_stats?: Array<{
    match_team_stats_id: string;
    total_score?: number;
    sets_won?: number;
    sets_lost?: number;
    is_winner?: boolean;
  }>;
}
