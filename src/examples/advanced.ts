/**
 * Advanced Example: Programmatic Server Control
 * 
 * This example shows advanced usage:
 * 1. Programmatic server control
 * 2. Direct message access
 * 3. Custom server configuration
 * 4. Error handling
 */

import { TwillioMockServer, createTwillioMockClient } from '../index';
import { Message } from '../types/Message';

async function main() {
  // Create server with custom configuration
  const server = new TwillioMockServer({
    port: 3030,
    enableCors: true,
  });

  // Start the server
  server.start();

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  const client = createTwillioMockClient({
    baseUrl: 'http://localhost:3030',
    accountSid: 'AC1234567890',
    timeout: 5000,
    debug: false,
  });

  try {
    // Send multiple messages
    console.log('Sending multiple messages...');
    const messages: Message[] = [];

    for (let i = 0; i < 3; i++) {
      const message = await client.messages.create({
        To: `+123456789${i}`,
        From: '+0987654321',
        Body: `Test message ${i + 1}`,
      });
      messages.push(message);
      console.log(`Sent message ${i + 1}: ${message.sid}`);
    }

    // Access messages directly from server
    console.log('\nAccessing messages directly from server...');
    const serverMessages = server.getMessages();
    console.log(`Server has ${serverMessages.length} messages`);

    // Filter messages
    const filteredMessages = serverMessages.filter(msg => msg.to.includes('789'));
    console.log(`Filtered messages: ${filteredMessages.length}`);

    // Clear messages programmatically
    console.log('\nClearing messages programmatically...');
    server.clearMessages();
    console.log(`Messages after clear: ${server.getMessages().length}`);

    // Test error handling
    console.log('\nTesting error handling...');
    try {
      await client.messages.create({
        To: '', // Invalid: empty to field
        From: '+0987654321',
        Body: 'This should fail',
      });
    } catch (error) {
      console.log('Caught expected error:', error instanceof Error ? error.message : error);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    // Stop the server
    server.stop();
    process.exit(0);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

