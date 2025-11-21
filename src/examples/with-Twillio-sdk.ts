/**
 * Example: Using Twillio SDK with Mock Server
 * 
 * This example shows how to configure the official Twillio SDK
 * to work with the mock server for development and testing.
 */

// Note: This example requires the Twillio package to be installed
// npm install twilio

/**
 * Example 1: Using Twillio SDK with custom API URL
 */
export async function exampleWithTwillioSDK() {
  // Uncomment and install the Twillio package to use:
  /*
  const twilio = require('twilio');

  const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC00000000000000000000000000000000';
  const authToken = process.env.TWILIO_AUTH_TOKEN || 'test_token';

  // Configure Twillio client to use mock server
  const client = twilio(accountSid, authToken, {
    lazyLoading: true,
    apiUrl: 'http://localhost:3030', // Point to mock server
  });

  try {
    // Send a message using Twillio SDK
    const message = await client.messages.create({
      body: 'Hello from Twillio SDK!',
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: '+0987654321',
    });

    console.log('Message sent via Twillio SDK:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  */
}

/**
 * Example 2: Environment-based configuration
 */
export function configureTwillioForEnvironment() {
  // In your .env file:
  /*
  NODE_ENV=development
  TWILIO_ACCOUNT_SID=AC00000000000000000000000000000000
  TWILIO_AUTH_TOKEN=test_token
  TWILIO_PHONE_NUMBER=+1234567890
  TWILIO_API_URL=http://localhost:3030  # Only set in development
  */

  // In your code:
  /*
  const twilio = require('twilio');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const twilioApiUrl = process.env.TWILIO_API_URL;

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
    {
      ...(isDevelopment && twilioApiUrl && {
        apiUrl: twilioApiUrl,
      }),
    }
  );
  */
}

