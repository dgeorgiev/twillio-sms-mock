/**
 * Generate a random string similar to Twillio SIDs
 * @param length Length of the string to generate
 * @returns Random hexadecimal string
 */
export function generateRandomString(length: number): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a Twillio-like message SID
 * @returns Message SID starting with 'SM'
 */
export function generateMessageSid(): string {
  return `SM${generateRandomString(32)}`;
}

