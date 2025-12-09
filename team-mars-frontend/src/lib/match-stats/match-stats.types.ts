// Match Team Stats Types

export interface MatchTeamStatsSimple {
  match_team_stats_id: string;
  match_id: string;
  team_id: string;
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
  is_winner?: boolean;
}

export interface MatchTeamStatsFull {
  match_team_stats_id: string;
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
  is_winner?: boolean;
  match?: {
    match_id: string;
    match_date: string;
    location: string;
    league_id: string;
    team1_id: string;
    team2_id: string;
  };
  team?: {
    team_id: string;
    team_name: string;
  };
}

export interface MatchTeamStatsCreate {
  match_id: string;
  team_id: string;
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
  is_winner?: boolean;
}

export interface MatchTeamStatsUpdate {
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
  is_winner?: boolean;
}

// Match Results Types

export interface FinalScores {
  team1_name: string;
  team1_total_score: number;
  team2_name: string;
  team2_total_score: number;
}

export interface FinalSets {
  team1_sets_won: number;
  team2_sets_won: number;
}

export interface MatchResultsSummary {
  final_scores: FinalScores;
  final_sets: FinalSets;
}

export interface TeamStatsUpdate {
  total_score?: number;
  sets_won?: number;
  sets_lost?: number;
}

export interface MatchResultsUpdate {
  team1_id: string;
  team1_stats: TeamStatsUpdate;
  team2_id: string;
  team2_stats: TeamStatsUpdate;
}
