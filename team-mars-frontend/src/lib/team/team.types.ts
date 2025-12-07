import type { Team, TeamPlayer, League, Player } from '@/types/base_types';
import type { TeamCreate } from '@/types/create_types';
import type { TeamFilters } from '@/types/filter_types';
import type { TeamWithDetails, TeamPlayerWithPlayer } from '@/types/relationship_types';
import type { PaginationParams } from '@/types/utils';

// Re-export for external use
export type {
  Team,
  TeamPlayer,
  TeamCreate,
  TeamFilters,
  TeamWithDetails,
  TeamPlayerWithPlayer,
  PaginationParams,
  League,
  Player,
};

export interface TeamWithCounts extends Team {
  active_player_count?: number;
  total_player_count?: number;
  player_count?: number;
  match_count?: number;
  team_players?: TeamPlayerWithPlayer[];
  league?: League;
}

export type FetchTeamsParams = TeamFilters;

export type TeamsEnvelope = {
  teams?: TeamWithCounts[];
  data?: TeamWithCounts[];
  results?: TeamWithCounts[];
};
