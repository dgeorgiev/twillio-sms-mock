import { Message, CreateMessageRequest } from './Message';

/**
 * Configuration options for the Twillio Mock Client
 */
export interface ClientConfig {
  /** Base URL of the mock server (e.g., 'http://localhost:3030') */
  baseUrl: string;
  /** Account SID to use (optional, defaults to mock value) */
  accountSid?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

/**
 * Messages API interface
 */
export interface MessagesAPI {
  /**
   * Create and send a new message
   * @param params Message creation parameters
   * @returns Promise resolving to the created message
   */
  create(params: CreateMessageRequest): Promise<Message>;
  
  /**
   * Get all messages from the mock server
   * @returns Promise resolving to array of messages
   */
  list(): Promise<Message[]>;
  
  /**
   * Clear all messages from the mock server
   * @returns Promise resolving when messages are cleared
   */
  clear(): Promise<void>;
}

/**
 * Twillio Mock Client interface
 */
export interface TwillioMockClient {
  /** Messages API */
  messages: MessagesAPI;
}

