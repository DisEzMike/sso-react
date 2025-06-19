import { randomBytes } from 'crypto';

export function generateClientCredentials() {
  const client_id = randomBytes(16).toString('hex');
  const client_secret = randomBytes(32).toString('hex');
  return { client_id, client_secret };
}

export function generateCode() {
  return randomBytes(16).toString('hex');
}