/**
 * Twillio Message interface matching Twillio's API response format
 */
export interface Message {
  /** Message SID (unique identifier) */
  sid: string;
  /** ISO 8601 date when the message was created */
  date_created: string;
  /** ISO 8601 date when the message was last updated */
  date_updated: string;
  /** ISO 8601 date when the message was sent */
  date_sent: string;
  /** Account SID that sent the message */
  account_sid: string;
  /** Recipient phone number */
  to: string;
  /** Sender phone number or alphanumeric sender ID */
  from: string;
  /** Message body text */
  body: string;
  /** Message status (sent, queued, failed, etc.) */
  status: string;
  /** Number of message segments */
  num_segments: string;
  /** Number of media attachments */
  num_media: string;
  /** Message direction */
  direction: string;
  /** API version used */
  api_version: string;
  /** Message price (null for mock) */
  price: string | null;
  /** Price unit (USD) */
  price_unit: string;
  /** Error code if message failed */
  error_code: string | null;
  /** Error message if message failed */
  error_message: string | null;
  /** Resource URI */
  uri: string;
  /** Subresource URIs */
  subresource_uris: {
    media: string;
  };
}

/**
 * Request body for creating a message
 */
export interface CreateMessageRequest {
  /** Recipient phone number */
  To: string;
  /** Sender phone number or alphanumeric sender ID */
  From: string;
  /** Message body text */
  Body: string;
  /** Optional messaging service SID */
  MessagingServiceSid?: string;
}

