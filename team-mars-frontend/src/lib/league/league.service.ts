import { apiClient } from '../api';
import type { League, LeagueFull, FetchLeaguesParams } from './league.types';

class LeagueApiService {
  private readonly basePath = '/league';

  async fetchLeagues(params?: FetchLeaguesParams): Promise<League[]> {
    const leagues = await apiClient.get<League[]>(this.basePath);

    if (params?.limit) {
      return leagues.slice(0, params.limit);
    }

    return leagues;
  }

  async fetchLeague(leagueId: string): Promise<LeagueFull> {
    return apiClient.get<LeagueFull>(`${this.basePath}/${leagueId}`);
  }

  async createLeague(data: Partial<League>): Promise<LeagueFull> {
    return apiClient.post<LeagueFull>(this.basePath, data);
  }

  async updateLeague(leagueId: string, data: Partial<League>): Promise<LeagueFull> {
    return apiClient.put<LeagueFull>(`${this.basePath}/${leagueId}`, data);
  }

  async deleteLeague(leagueId: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${leagueId}`);
  }
}

export const leagueApiService = new LeagueApiService();
