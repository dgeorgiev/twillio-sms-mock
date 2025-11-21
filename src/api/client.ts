import http from 'http';
import https from 'https';
import querystring from 'querystring';

// Use global URL if available (Node.js 10+), otherwise fall back to url module
const URLConstructor = (typeof globalThis !== 'undefined' && globalThis.URL) || 
                       (typeof global !== 'undefined' && (global as any).URL) ||
                       require('url').URL;
import { ClientConfig, TwillioMockClient, MessagesAPI } from '../types/Client';
import { Message, CreateMessageRequest } from '../types/Message';

/**
 * HTTP client for making requests to the Twillio mock server
 */
class TwillioMockClientImpl implements TwillioMockClient {
  public messages: MessagesAPI;
  private config: Required<ClientConfig>;

  constructor(config: ClientConfig) {
    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }

    this.config = {
      baseUrl: config.baseUrl,
      accountSid: config.accountSid || process.env.TWILIO_ACCOUNT_SID || 'AC00000000000000000000000000000000',
      timeout: config.timeout || 10000,
      debug: config.debug || false,
    };

    this.messages = {
      create: this.createMessage.bind(this),
      list: this.listMessages.bind(this),
      clear: this.clearMessages.bind(this),
    };
  }

  /**
   * Create and send a new message
   */
  private async createMessage(params: CreateMessageRequest): Promise<Message> {
    const accountSid = this.config.accountSid;
    const path = `/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const formData: Record<string, string> = {
      To: params.To,
      From: params.From,
      Body: params.Body,
    };

    if (params.MessagingServiceSid) {
      formData.MessagingServiceSid = params.MessagingServiceSid;
    }

    const response = await this.request({
      method: 'POST',
      path,
      formData,
    });

    return response.body as Message;
  }

  /**
   * Get all messages from the mock server
   */
  private async listMessages(): Promise<Message[]> {
    const response = await this.request({
      method: 'GET',
      path: '/api/messages',
    });

    return response.body as Message[];
  }

  /**
   * Clear all messages from the mock server
   */
  private async clearMessages(): Promise<void> {
    await this.request({
      method: 'DELETE',
      path: '/api/messages',
    });
  }

  /**
   * Make an HTTP request to the mock server
   */
  private async request(options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    formData?: Record<string, string>;
  }): Promise<{ statusCode: number; body: any }> {
    const { method, path, formData } = options;
    const urlObj = new URLConstructor(this.config.baseUrl);
    const port = urlObj.port ? parseInt(urlObj.port, 10) : (urlObj.protocol === 'https:' ? 443 : 80);

    if (this.config.debug) {
      console.log(`[TwillioMock] ${method} ${urlObj.protocol}//${urlObj.hostname}:${port}${path}`);
    }

    return new Promise((resolve, reject) => {
      let postData = '';
      const headers: Record<string, string> = {};

      if ((method === 'POST' || method === 'PUT') && formData) {
        postData = querystring.stringify(formData);
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['Content-Length'] = Buffer.byteLength(postData).toString();
      }

      const requestOptions: any = {
        hostname: urlObj.hostname,
        port: port,
        path: path,
        method: method,
        headers: headers,
      };

      // Force IPv4 for localhost
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        requestOptions.family = 4;
      }

      const httpModule = urlObj.protocol === 'https:' ? https : http;

      const req = httpModule.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              let parsedBody: any;
              try {
                parsedBody = JSON.parse(data);
              } catch {
                parsedBody = data;
              }

              resolve({
                statusCode: res.statusCode!,
                body: parsedBody,
              });
            } else {
              reject(new Error(`Mock server returned error: ${res.statusCode} - ${data}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        if (this.config.debug) {
          console.error(`[TwillioMock] Request error:`, error);
        }
        reject(error);
      });

      req.setTimeout(this.config.timeout, () => {
        req.destroy();
        reject(new Error(`Request timeout: Mock server did not respond within ${this.config.timeout}ms`));
      });

      if (postData) {
        req.write(postData);
      }

      req.end();
    });
  }
}

/**
 * Create a new Twillio Mock Client instance
 * @param config Client configuration
 * @returns Twillio Mock Client instance
 * 
 * @example
 * ```typescript
 * const client = createTwillioMockClient({
 *   baseUrl: 'http://localhost:3030'
 * });
 * 
 * const message = await client.messages.create({
 *   to: '+1234567890',
 *   from: '+0987654321',
 *   body: 'Hello, world!'
 * });
 * ```
 */
export function createTwillioMockClient(config: ClientConfig): TwillioMockClient {
  return new TwillioMockClientImpl(config);
}

/**
 * Twillio Mock Client class (alternative to factory function)
 */
export class TwillioMockClientClass extends TwillioMockClientImpl {
  constructor(config: ClientConfig) {
    super(config);
  }
}

