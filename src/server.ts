import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Message, CreateMessageRequest } from './types/Message';
import { ServerConfig, ServerInstance } from './types/Server';
import { generateMessageSid } from './utils/helpers';

const DEFAULT_PORT = 3030;

/**
 * Twillio Mock Server
 * 
 * A local mock server that mimics Twillio's SMS API for development and testing.
 */
export class TwillioMockServer implements ServerInstance {
  private app: Application;
  private server: any;
  private messages: Message[] = [];
  private config: Required<ServerConfig>;

  constructor(config: ServerConfig = {}) {
    this.config = {
      port: config.port ?? DEFAULT_PORT,
      enableCors: config.enableCors ?? true,
      staticDir: config.staticDir ?? path.join(__dirname, '..'),
    };

    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Body parsing
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // CORS headers
    if (this.config.enableCors) {
      this.app.use((req: Request, res: Response, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
          return;
        }
        next();
      });
    }

    // Serve static files (for the UI)
    this.app.use(express.static(path.join(__dirname, '..')));
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Mock Twillio API endpoint - POST /2010-04-01/Accounts/{AccountSid}/Messages.json
    this.app.post('/2010-04-01/Accounts/:accountSid/Messages.json', (req: Request, res: Response): void => {
      try {
        const accountSid = req.params.accountSid;
        const body = req.body as CreateMessageRequest;

        // Validate required fields
        if (!body.To || !body.From || !body.Body) {
          res.status(400).json({
            error: 'Missing required fields',
            code: 21211,
            message: 'To, From, and Body are required fields',
          });
          return;
        }

        const messageSid = generateMessageSid();
        const message: Message = {
          sid: messageSid,
          date_created: new Date().toISOString(),
          date_updated: new Date().toISOString(),
          date_sent: new Date().toISOString(),
          account_sid: accountSid,
          to: body.To,
          from: body.From,
          body: body.Body,
          status: 'sent',
          num_segments: '1',
          num_media: '0',
          direction: 'outbound-api',
          api_version: '2010-04-01',
          price: null,
          price_unit: 'USD',
          error_code: null,
          error_message: null,
          uri: `/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}.json`,
          subresource_uris: {
            media: `/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}/Media.json`,
          },
        };

        this.messages.unshift(message);

        console.log(`[SMS SENT] To: ${message.to}, From: ${message.from}, Body: ${message.body.substring(0, 50)}${message.body.length > 50 ? '...' : ''}`);

        // Return Twillio-like response
        res.status(201).json(message);
      } catch (error) {
        console.error('[ERROR] Failed to create message:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 20001,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // API endpoint to get all messages
    this.app.get('/api/messages', (_req: Request, res: Response) => {
      res.json(this.messages);
    });

    // API endpoint to clear all messages
    this.app.delete('/api/messages', (_req: Request, res: Response) => {
      this.messages.length = 0;
      res.json({ success: true, message: 'All messages cleared' });
    });

    // Serve the UI
    this.app.get('/', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '..', 'index.html'));
    });

    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({
        status: 'ok',
        messages: this.messages.length,
        uptime: process.uptime(),
      });
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    if (this.server) {
      console.log('[WARN] Server is already running');
      return;
    }

    this.server = this.app.listen(this.config.port, () => {
      console.log(`🚀 Twillio Mock Server running on http://localhost:${this.config.port}`);
      console.log(`📱 View messages at: http://localhost:${this.config.port}`);
      console.log(`⚙️  API endpoint: http://localhost:${this.config.port}/2010-04-01/Accounts/{AccountSid}/Messages.json`);
      console.log(`\nUpdate your .env to:`);
      console.log(`TWILIO_API_URL=http://localhost:${this.config.port}`);
    });
  }

  /**
   * Stop the server
   */
  public stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
      console.log('Server stopped');
    }
  }

  /**
   * Get the Express app instance
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Get all stored messages
   */
  public getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Clear all stored messages
   */
  public clearMessages(): void {
    this.messages.length = 0;
  }
}

// If running directly, start the server
if (require.main === module) {
  const server = new TwillioMockServer();
  server.start();
}

