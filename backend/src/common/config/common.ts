export const HASH_SALT_ROUNDS =
  parseInt(process.env.HASH_SALT_ROUNDS, 10) || 10;

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY || '5m';
export const REFRESH_TOKEN_EXPIRY =
  parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10) || 14400; // 14400
