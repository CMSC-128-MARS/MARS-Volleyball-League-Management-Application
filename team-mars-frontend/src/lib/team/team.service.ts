import { httpClient } from '../http/axios-client';
import type { Team } from '@/types/base_types';
import type { TeamCreate } from '@/types/create_types';
import type { TeamWithCounts, TeamsEnvelope, FetchTeamsParams } from './team.types';
import { normalizeTeamsResponse } from './team.utils';

export class TeamApiService {
  private readonly baseUrl = '/team';

  async fetchTeams(params: FetchTeamsParams = {}): Promise<TeamWithCounts[]> {
    const response = await httpClient.get<TeamWithCounts[] | TeamsEnvelope>(this.baseUrl, {
      params: {
        limit: params.limit,
        skip: params.skip,
        league_id: params.league_id,
      },
    });
    return normalizeTeamsResponse(response);
  }

  async createTeam(payload: TeamCreate): Promise<Team> {
    return httpClient.post<Team>(this.baseUrl, payload);
  }

  async getTeamById(teamId: string): Promise<TeamWithCounts> {
    return httpClient.get<TeamWithCounts>(`${this.baseUrl}/${teamId}`);
  }

  async updateTeam(teamId: string, payload: Partial<TeamCreate>): Promise<Team> {
    return httpClient.put<Team>(`${this.baseUrl}/${teamId}`, payload);
  }

  deleteTeam(teamId: string): Promise<void> {
    return httpClient.delete<void>(`${this.baseUrl}/${teamId}`);
  }

  async addPlayerToTeam(teamId: string, playerId: string, position?: string): Promise<void> {
    return httpClient.post<void>('/team-players', {
      team_id: teamId,
      player_id: playerId,
      position: position || null,
      join_date: new Date().toISOString(),
    });
  }

  async deleteTeamPlayer(teamPlayerId: string): Promise<void> {
    return httpClient.delete<void>(`/team-players/${teamPlayerId}`);
  }

  async removePlayerFromTeam(teamId: string, playerId: string): Promise<void> {
    // Find the active team_player row for this team+player, then call the
    // backend endpoint to set the leave_date (soft remove).
    type TeamPlayerResp = {
      team_player_id?: string;
      teamPlayerId?: string;
      id?: string;
      player?: { player_id?: string } | null;
      player_id?: string;
    };

    const teamPlayers = await httpClient.get<TeamPlayerResp[]>(`/team-players/team/${teamId}`, {
      params: { active_only: true },
    });

    const match = teamPlayers.find(
      (tp) => tp.player?.player_id === playerId || tp.player_id === playerId,
    );
    if (!match) {
      // Nothing to remove
      return;
    }

    const teamPlayerId = match.team_player_id || match.teamPlayerId || match.id;
    if (!teamPlayerId) {
      // If shape unexpected, fallback to throwing so callers can handle
      throw new Error('Could not determine team_player id for removal');
    }

    return httpClient.post<void>(`/team-players/${teamPlayerId}/remove`);
  }
}

export const teamApiService = new TeamApiService();
