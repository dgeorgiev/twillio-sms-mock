/**
 * Basic Example: Using the Twillio Mock Server
 * 
 * This example shows how to:
 * 1. Start the mock server
 * 2. Use the client API to send messages
 * 3. List and clear messages
 */

import { createTwillioMockServer, createTwillioMockClient } from '../index';

async function main() {
  // Start the mock server
  console.log('Starting Twillio Mock Server...');
  const server = createTwillioMockServer({ port: 3030 });
  server.start();

  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create a client to interact with the server
  const client = createTwillioMockClient({
    baseUrl: 'http://localhost:3030',
    debug: true,
  });

  try {
    // Send a message
    console.log('\nSending a test message...');
    const message = await client.messages.create({
      To: '+1234567890',
      From: '+0987654321',
      Body: 'Hello from Twillio Mock!',
    });

    console.log('Message sent:', message.sid);
    console.log('Message details:', {
      to: message.to,
      from: message.from,
      body: message.body,
      status: message.status,
    });

    // List all messages
    console.log('\nFetching all messages...');
    const messages = await client.messages.list();
    console.log(`Total messages: ${messages.length}`);

    // Clear all messages
    console.log('\nClearing all messages...');
    await client.messages.clear();
    console.log('Messages cleared');

    // Verify messages are cleared
    const remainingMessages = await client.messages.list();
    console.log(`Remaining messages: ${remainingMessages.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Stop the server
    console.log('\nStopping server...');
    server.stop();
    process.exit(0);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

