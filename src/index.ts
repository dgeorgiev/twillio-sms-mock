/**
 * Twillio Mock Server
 * 
 * A local mock server that mimics Twillio's SMS API for development and testing.
 * 
 * @packageDocumentation
 */

// Server exports
export { TwillioMockServer, createTwillioMockServer } from './api/server';

// Client exports
export { createTwillioMockClient, TwillioMockClientClass } from './api/client';

// Type exports
export type { Message, CreateMessageRequest } from './types/Message';
export type { ServerConfig, ServerInstance } from './types/Server';
export type { ClientConfig, TwillioMockClient, MessagesAPI } from './types/Client';
export type { APIResponse, HealthResponse, ClearMessagesResponse, ErrorResponse } from './types/API';

// Default export for convenience
import { TwillioMockServer } from './api/server';
export default TwillioMockServer;

