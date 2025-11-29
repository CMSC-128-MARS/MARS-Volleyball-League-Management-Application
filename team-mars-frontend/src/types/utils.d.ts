// ============================================================================
// Utility Types
// ============================================================================

export type UUID = string;

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'unhealthy';
  service: string;
  environment: string;
  database?: 'connected' | 'disconnected';
  database_time?: string;
}
