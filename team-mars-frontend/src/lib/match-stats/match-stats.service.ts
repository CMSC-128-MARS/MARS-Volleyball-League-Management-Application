import { apiClient } from '../api';
import type {
  MatchTeamStatsSimple,
  MatchTeamStatsFull,
  MatchTeamStatsCreate,
  MatchTeamStatsUpdate,
  MatchResultsSummary,
  MatchResultsUpdate,
} from './match-stats.types';

class MatchStatsApiService {
  private readonly baseUrl = '/match-stats';

  /**
   * Create new match team stats entry
   */
  async createMatchTeamStats(data: MatchTeamStatsCreate): Promise<MatchTeamStatsSimple> {
    return await apiClient.post<MatchTeamStatsSimple>(this.baseUrl, data);
  }

  /**
   * List all match team stats with pagination
   */
  async listMatchTeamStats(skip: number = 0, limit: number = 100): Promise<MatchTeamStatsFull[]> {
    return await apiClient.get<MatchTeamStatsFull[]>(`${this.baseUrl}?skip=${skip}&limit=${limit}`);
  }

  /**
   * Get match team stats by ID
   */
  async getMatchTeamStatsById(matchTeamStatsId: string): Promise<MatchTeamStatsFull> {
    return await apiClient.get<MatchTeamStatsFull>(`${this.baseUrl}/${matchTeamStatsId}`);
  }

  /**
   * Get all match team stats for a specific match
   */
  async getMatchTeamStatsByMatch(matchId: string): Promise<MatchTeamStatsFull[]> {
    return await apiClient.get<MatchTeamStatsFull[]>(`${this.baseUrl}/match/${matchId}`);
  }

  /**
   * Get all match team stats for a specific team
   */
  async getMatchTeamStatsByTeam(teamId: string): Promise<MatchTeamStatsFull[]> {
    return await apiClient.get<MatchTeamStatsFull[]>(`${this.baseUrl}/team/${teamId}`);
  }

  /**
   * Update match team stats by ID
   */
  async updateMatchTeamStats(
    matchTeamStatsId: string,
    data: MatchTeamStatsUpdate,
  ): Promise<MatchTeamStatsSimple> {
    return await apiClient.put<MatchTeamStatsSimple>(`${this.baseUrl}/${matchTeamStatsId}`, data);
  }

  /**
   * Delete match team stats by ID
   */
  async deleteMatchTeamStats(matchTeamStatsId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${matchTeamStatsId}`);
  }

  /**
   * Get match results summary for both teams
   */
  async getMatchResults(matchId: string): Promise<MatchResultsSummary> {
    return await apiClient.get<MatchResultsSummary>(`${this.baseUrl}/matches/${matchId}/results`);
  }

  /**
   * Update match results for both teams in a single request
   */
  async updateMatchResults(
    matchId: string,
    data: MatchResultsUpdate,
  ): Promise<MatchResultsSummary> {
    return await apiClient.put<MatchResultsSummary>(
      `${this.baseUrl}/matches/${matchId}/results`,
      data,
    );
  }
}

export const matchStatsApiService = new MatchStatsApiService();
