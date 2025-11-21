import { TwillioMockServer } from '../server';
import { ServerConfig } from '../types/Server';

/**
 * Create a new Twillio Mock Server instance
 * @param config Server configuration
 * @returns Twillio Mock Server instance
 * 
 * @example
 * ```typescript
 * const server = createTwillioMockServer({ port: 3030 });
 * server.start();
 * ```
 */
export function createTwillioMockServer(config?: ServerConfig): TwillioMockServer {
  return new TwillioMockServer(config);
}

// Re-export the class for convenience
export { TwillioMockServer };

