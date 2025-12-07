// ============================================================================
// Nested/Relationship Types (for GET requests with relationships)
// ============================================================================

import type {
  Player,
  PlayerSkill,
  TeamPlayer,
  Team,
  League,
  Match,
  Admin,
  SkillLevel,
} from './base_types';

export interface PlayerWithSkills extends Player {
  skills?: PlayerSkillWithDetails[];
  team_memberships?: TeamPlayerWithTeam[];
}

export interface PlayerSkillWithDetails extends PlayerSkill {
  player?: Player;
  skill_level?: SkillLevel;
  evaluator?: Admin;
}

export interface TeamPlayerWithTeam extends TeamPlayer {
  team?: Team;
  player?: Player;
}

export interface TeamWithDetails extends Team {
  league?: League;
  team_players?: TeamPlayerWithPlayer[];
  matches_as_team1?: Match[];
  matches_as_team2?: Match[];
}

export interface TeamPlayerWithPlayer extends TeamPlayer {
  player?: Player;
}

export interface LeagueWithDetails extends League {
  teams?: Team[];
  matches?: Match[];
}

export interface MatchWithDetails extends Match {
  league?: League;
  team1?: Team;
  team2?: Team;
  team_stats?: MatchTeamStatsWithTeam[];
}

export interface MatchTeamStatsWithTeam extends MatchTeamStats {
  match?: Match;
  team?: Team;
}
