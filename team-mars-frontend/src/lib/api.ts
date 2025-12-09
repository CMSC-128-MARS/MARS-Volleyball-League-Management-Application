import { teamApiService } from './team';
import { playerService } from './players';

// Re-export team types for backward compatibility
export type { TeamWithCounts as ApiTeam } from './team/team.types';
export type { TeamCreate as CreateTeamPayload } from '@/types/create_types';
export type { FetchTeamsParams } from './team/team.types';

const DEFAULT_BASE_URL = '/api';
const baseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const data = await response.clone().json();
    if (typeof data === 'string') {
      return data;
    }
    if (data?.detail) {
      return Array.isArray(data.detail)
        ? data.detail
            .map((item: { msg?: string } | string) =>
              typeof item === 'object' ? item.msg || JSON.stringify(item) : item,
            )
            .join(', ')
        : data.detail;
    }
    if (data?.message) {
      return data.message;
    }
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to parse error response', error);
    return response.statusText;
  }
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(path);
  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

const jsonHeaders = { 'Content-Type': 'application/json' } as const;

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      headers: { ...jsonHeaders, ...init?.headers },
      body: body !== undefined ? JSON.stringify(body) : null,
    }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'PUT',
      headers: { ...jsonHeaders, ...init?.headers },
      body: body !== undefined ? JSON.stringify(body) : null,
    }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'PATCH',
      headers: { ...jsonHeaders, ...init?.headers },
      body: body !== undefined ? JSON.stringify(body) : null,
    }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'DELETE',
    }),
};

export const fetchTeams = teamApiService.fetchTeams.bind(teamApiService);
export const createTeam = teamApiService.createTeam.bind(teamApiService);

export type ApiLeague = {
  league_id: string;
  league_name: string;
  start_date?: string;
  end_date?: string | null;
  location?: string;
  description?: string | null;
};

export interface FetchLeaguesParams {
  limit?: number;
  skip?: number;
}

type LeaguesEnvelope = {
  leagues?: ApiLeague[];
  data?: ApiLeague[];
  results?: ApiLeague[];
};

const normalizeLeagueResponse = (payload: ApiLeague[] | LeaguesEnvelope): ApiLeague[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.leagues)) {
    return payload.leagues;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};

export const fetchLeagues = async (params: FetchLeaguesParams = {}): Promise<ApiLeague[]> => {
  const searchParams = new URLSearchParams();

  if (typeof params.limit === 'number') {
    searchParams.set('limit', params.limit.toString());
  }

  if (typeof params.skip === 'number') {
    searchParams.set('skip', params.skip.toString());
  }

  const query = searchParams.toString();
  const endpoint = `/league${query ? `?${query}` : ''}`;
  const response = await apiClient.get<ApiLeague[] | LeaguesEnvelope>(endpoint);
  return normalizeLeagueResponse(response);
};

export type ApiPlayer = {
  player_id: string;
  first_name: string;
  last_name?: string | null;
  jersey_number?: number | null;
  default_position?: string | null;
  created_at?: string;
  updated_at?: string;
  skill_level?: number | null;
  skill_level_description?: string | null;
  date_evaluated?: string | null;
  notes?: string | null;
};

export interface FetchPlayersParams {
  limit?: number;
  skip?: number;
}

type PlayersEnvelope = {
  players?: ApiPlayer[];
  data?: ApiPlayer[];
  results?: ApiPlayer[];
};

const normalizePlayerResponse = (payload: ApiPlayer[] | PlayersEnvelope): ApiPlayer[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.players)) {
    return payload.players;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};

export const fetchPlayers = playerService.fetchPlayers.bind(playerService);
export const fetchPlayerById = playerService.fetchPlayerById.bind(playerService);
export const createPlayer = playerService.createPlayer.bind(playerService);
export const updatePlayer = playerService.updatePlayer.bind(playerService);
export const deletePlayer = playerService.deletePlayer.bind(playerService);
