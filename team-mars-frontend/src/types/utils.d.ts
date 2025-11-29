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

/**
 * Generic API response wrapper
 * @template T - The type of data returned in the response
 */
export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error';
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  status: 'error';
  error: string;
  message?: string;
  detail?: string;
}

/**
 * API Success response

 */
export interface ApiSuccessResponse<T> {
  status: 'ok';
  data: T;
  message?: string;
}

/**
 * Health check response from /health endpoint
 */
export interface HealthCheckResponse {
  status: 'ok' | 'unhealthy';
  service: string;
  environment: string;
  database?: 'connected' | 'disconnected';
  database_time?: string;
}

/**
 * Database health check response from /health/db endpoint
 */
export interface DatabaseHealthResponse {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
  database_name?: string;
  database_time?: string;
  database_version?: string;
  message: string;
  error?: string;
}
