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

export type ApiTeam = {
  team_id: string;
  team_name: string;
  league_id?: string;
  created_at?: string;
  active_player_count?: number;
  total_player_count?: number;
  player_count?: number;
  match_count?: number;
  team_players?: Array<{ leave_date?: string | null }>;
};

export interface FetchTeamsParams {
  limit?: number;
  skip?: number;
  league_id?: string;
}

type TeamsEnvelope = {
  teams?: ApiTeam[];
  data?: ApiTeam[];
  results?: ApiTeam[];
};

const normalizeTeamResponse = (payload: ApiTeam[] | TeamsEnvelope): ApiTeam[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.teams)) {
    return payload.teams;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};

export const fetchTeams = async (params: FetchTeamsParams = {}): Promise<ApiTeam[]> => {
  const searchParams = new URLSearchParams();

  if (typeof params.limit === 'number') {
    searchParams.set('limit', params.limit.toString());
  }

  if (typeof params.skip === 'number') {
    searchParams.set('skip', params.skip.toString());
  }

  if (params.league_id) {
    searchParams.set('league_id', params.league_id);
  }

  const query = searchParams.toString();
  const endpoint = `/team${query ? `?${query}` : ''}`;
  const response = await apiClient.get<ApiTeam[] | TeamsEnvelope>(endpoint);
  return normalizeTeamResponse(response);
};
