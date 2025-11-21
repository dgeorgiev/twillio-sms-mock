/**
 * Configuration options for the Twillio Mock Server
 */
export interface ServerConfig {
  /** Port number to run the server on (default: 3030) */
  port?: number;
  /** Enable CORS headers (default: true) */
  enableCors?: boolean;
  /** Custom static files directory (default: current directory) */
  staticDir?: string;
}

import { Message } from './Message';

/**
 * Server instance with start/stop methods
 */
export interface ServerInstance {
  /** Start the server */
  start(): void;
  /** Stop the server */
  stop(): void;
  /** Get the Express app instance */
  getApp(): any;
  /** Get all stored messages */
  getMessages(): Message[];
  /** Clear all stored messages */
  clearMessages(): void;
}

