import { apiClient } from '../api';
import type { Match, MatchCreate, MatchUpdate, MatchWithTeams, MatchFull } from './match.types';

class MatchApiService {
  private readonly baseUrl = '/match';

  async fetchMatches(): Promise<MatchWithTeams[]> {
    return await apiClient.get<MatchWithTeams[]>(this.baseUrl);
  }

  async fetchMatch(matchId: string): Promise<MatchFull> {
    return await apiClient.get<MatchFull>(`${this.baseUrl}/${matchId}`);
  }

  async createMatch(data: MatchCreate): Promise<Match> {
    return await apiClient.post<Match>(this.baseUrl, data);
  }

  async updateMatch(matchId: string, data: MatchUpdate): Promise<MatchFull> {
    return await apiClient.put<MatchFull>(`${this.baseUrl}/${matchId}`, data);
  }

  async deleteMatch(matchId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${matchId}`);
  }
}

export const matchApiService = new MatchApiService();
