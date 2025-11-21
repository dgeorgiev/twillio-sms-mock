# Twillio Mock Server

![npm version](https://img.shields.io/npm/v/twillio-sms-mock?style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dm/twillio-sms-mock?style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/twillio-sms-mock?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

A local mock server that mimics Twillio's SMS API for development and testing. Built with TypeScript for full type safety and an easy-to-use API.

## Features

- ✅ **Twillio-Compatible API** - Drop-in replacement for Twillio's SMS API
- 📱 **Clean Web UI** - View all sent messages in a beautiful web interface
- 🔄 **Auto-refresh** - Messages update automatically every 5 seconds
- 🗑️ **Easy Management** - Clear all messages with one click
- 💾 **In-Memory Storage** - Fast and lightweight (resets on restart)
- 🎯 **TypeScript Support** - Full type definitions and IntelliSense
- 🚀 **Easy-to-Use API** - Simple, intuitive client API
- 🔧 **Programmatic Control** - Control the server programmatically
- 🌐 **CORS Enabled** - Works with any frontend application

## Installation

```bash
npm install twillio-sms-mock
```

Or with yarn:

```bash
yarn add twillio-sms-mock
```

## Quick Start

### Option 1: Command Line (Simple)

```bash
# Install globally
npm install -g twillio-sms-mock

# Start the server
twillio-sms-mock
```

The server will start on `http://localhost:3030`

### Option 2: Programmatic (Recommended)

```typescript
import { createTwillioMockServer, createTwillioMockClient } from 'twillio-sms-mock';

// Start the server
const server = createTwillioMockServer({ port: 3030 });
server.start();

// Use the client API
const client = createTwillioMockClient({
  baseUrl: 'http://localhost:3030'
});

// Send a message
const message = await client.messages.create({
  To: '+1234567890',
  From: '+0987654321',
  Body: 'Hello, world!'
});

console.log('Message sent:', message.sid);
```

### Option 3: Using with Twillio SDK

Configure your Twillio client to use the mock server:

```typescript
import twillio from 'twilio';

const client = twillio(
  process.env.TWILLIO_ACCOUNT_SID,
  process.env.TWILLIO_AUTH_TOKEN,
  {
    apiUrl: 'http://localhost:3030' // Point to mock server
  }
);

// Use exactly like the real Twillio SDK
const message = await client.messages.create({
  to: '+1234567890',
  from: '+0987654321',
  body: 'Hello from Twillio SDK!'
});
```

## Usage

### Server API

#### Starting the Server

```typescript
import { createTwillioMockServer } from 'twillio-sms-mock';

const server = createTwillioMockServer({
  port: 3030,        // Optional, defaults to 3030
  enableCors: true,  // Optional, defaults to true
});

server.start();
```

#### Server Methods

```typescript
// Start the server
server.start();

// Stop the server
server.stop();

// Get all messages
const messages = server.getMessages();

// Clear all messages
server.clearMessages();

// Get the Express app instance (for advanced usage)
const app = server.getApp();
```

### Client API

#### Creating a Client

```typescript
import { createTwillioMockClient } from 'twillio-sms-mock';

const client = createTwillioMockClient({
  baseUrl: 'http://localhost:3030',
  accountSid: 'AC1234567890',  // Optional
  timeout: 10000,               // Optional, defaults to 10000ms
  debug: false,                 // Optional, defaults to false
});
```

#### Sending Messages

```typescript
const message = await client.messages.create({
  To: '+1234567890',
  From: '+0987654321',
  Body: 'Hello, world!',
  MessagingServiceSid: 'MG1234567890' // Optional
});
```

#### Listing Messages

```typescript
const messages = await client.messages.list();
console.log(`Total messages: ${messages.length}`);
```

#### Clearing Messages

```typescript
await client.messages.clear();
```

### REST API

The server also exposes REST endpoints that are compatible with Twillio's API:

#### Send SMS

```http
POST /2010-04-01/Accounts/{AccountSid}/Messages.json
Content-Type: application/x-www-form-urlencoded

To=+1234567890&From=+0987654321&Body=Hello
```

#### Get All Messages

```http
GET /api/messages
```

#### Clear All Messages

```http
DELETE /api/messages
```

#### Health Check

```http
GET /health
```

## Web UI

Once the server is running, open your browser to:

```
http://localhost:3030
```

The web UI provides:
- 📊 Real-time message statistics
- 📱 Message list with details
- 🔄 Auto-refresh (every 5 seconds)
- 🗑️ Clear all messages button
- 📋 Copy message SIDs

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  Message, 
  CreateMessageRequest,
  ServerConfig,
  ClientConfig,
  TwillioMockClient 
} from 'twillio-sms-mock';

// All types are available for your use
const config: ServerConfig = {
  port: 3030
};

const message: Message = await client.messages.create({
  To: '+1234567890',
  From: '+0987654321',
  Body: 'Hello'
});
```

## Examples

### Basic Example

```typescript
import { createTwillioMockServer, createTwillioMockClient } from 'twillio-sms-mock';

async function main() {
  // Start server
  const server = createTwillioMockServer({ port: 3030 });
  server.start();

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create client
  const client = createTwillioMockClient({
    baseUrl: 'http://localhost:3030'
  });

  // Send message
  const message = await client.messages.create({
    To: '+1234567890',
    From: '+0987654321',
    Body: 'Hello from Twillio Mock!'
  });

  console.log('Message sent:', message.sid);

  // List messages
  const messages = await client.messages.list();
  console.log(`Total messages: ${messages.length}`);

  // Clean up
  server.stop();
}

main();
```

### Using with Environment Variables

```typescript
// .env
TWILLIO_API_URL=http://localhost:3030
TWILLIO_ACCOUNT_SID=AC00000000000000000000000000000000
TWILLIO_AUTH_TOKEN=test_token

// app.ts
import twillio from 'twilio';

const isDevelopment = process.env.NODE_ENV === 'development';
const twillioApiUrl = process.env.TWILLIO_API_URL;

const client = twillio(
  process.env.TWILLIO_ACCOUNT_SID,
  process.env.TWILLIO_AUTH_TOKEN,
  {
    ...(isDevelopment && twillioApiUrl && {
      apiUrl: twillioApiUrl
    })
  }
);

// Use normally - will use mock in development, real Twillio in production
const message = await client.messages.create({
  To: '+1234567890',
  From: '+0987654321',
  Body: 'Hello!'
});
```

## API Reference

### Types

#### `Message`

```typescript
interface Message {
  sid: string;
  date_created: string;
  date_updated: string;
  date_sent: string;
  account_sid: string;
  to: string;
  from: string;
  body: string;
  status: string;
  num_segments: string;
  num_media: string;
  direction: string;
  api_version: string;
  price: string | null;
  price_unit: string;
  error_code: string | null;
  error_message: string | null;
  uri: string;
  subresource_uris: {
    media: string;
  };
}
```

#### `ServerConfig`

```typescript
interface ServerConfig {
  port?: number;        // Default: 3030
  enableCors?: boolean; // Default: true
  staticDir?: string;   // Default: current directory
}
```

#### `ClientConfig`

```typescript
interface ClientConfig {
  baseUrl: string;      // Required
  accountSid?: string;  // Optional
  timeout?: number;     // Default: 10000ms
  debug?: boolean;      // Default: false
}
```

## Development

### Building

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode (with auto-reload)
npm run dev

# Run production build
npm start

# Type check without building
npm run type-check
```

### Project Structure

```
twillio-sms-mock/
├── src/
│   ├── api/
│   │   ├── client.ts      # Client API
│   │   └── server.ts      # Server API
│   ├── types/
│   │   ├── Message.ts     # Message types
│   │   ├── Server.ts      # Server types
│   │   ├── Client.ts      # Client types
│   │   └── API.ts         # API types
│   ├── utils/
│   │   └── helpers.ts     # Utility functions
│   ├── examples/          # Example files
│   ├── server.ts          # Main server implementation
│   └── index.ts           # Main export file
├── dist/                  # Compiled JavaScript
├── index.html             # Web UI
└── package.json
```

## Troubleshooting

### Server won't start

- Check if port 3030 is already in use
- Try a different port: `createTwillioMockServer({ port: 3031 })`

### Messages not appearing

- Ensure the server is running
- Check the baseUrl in your client configuration
- Verify CORS is enabled if calling from a browser

### TypeScript errors

- Ensure you have `@types/node` and `@types/express` installed
- Run `npm run type-check` to see detailed errors
- Make sure you're importing from the main package, not source files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Inspired by the need for local Twillio testing
- TypeScript for type safety

---

Made with ❤️ for developers who want to test Twillio integrations locally
