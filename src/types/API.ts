/**
 * API response wrapper
 */
export interface APIResponse<T = any> {
  /** HTTP status code */
  statusCode: number;
  /** Response data */
  data: T;
}

/**
 * Health check response
 */
export interface HealthResponse {
  /** Server status */
  status: string;
  /** Number of messages stored */
  messages: number;
  /** Server uptime in seconds */
  uptime: number;
}

/**
 * Clear messages response
 */
export interface ClearMessagesResponse {
  /** Success flag */
  success: boolean;
  /** Response message */
  message: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  /** Error message */
  error: string;
  /** Error code (optional) */
  code?: string;
}

