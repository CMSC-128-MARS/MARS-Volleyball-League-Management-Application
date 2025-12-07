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
    return httpClient.post<void>('/team-player', {
      team_id: teamId,
      player_id: playerId,
      position: position || null,
      join_date: new Date().toISOString(),
    });
  }

  async removePlayerFromTeam(teamId: string, playerId: string): Promise<void> {
    // This sets the leave_date for the team-player relationship
    return httpClient.patch<void>('/team-player', {
      team_id: teamId,
      player_id: playerId,
      leave_date: new Date().toISOString(),
    });
  }
}

export const teamApiService = new TeamApiService();
