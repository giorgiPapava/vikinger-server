const jwt = require('jsonwebtoken');

export const APP_SECRET = 'vikinger-server';

interface TokenPayload {
  userId: number;
  iat: number;
}

function getTokenPayload(token: string): TokenPayload {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(authToken?: string) {
  if (authToken) {
    const token = authToken.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token found');
    }
    const { userId } = getTokenPayload(token);
    return userId;
  }
  throw new Error('Not authenticated');
}
