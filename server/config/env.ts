import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'justyou-super-secret-jwt-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'justyou-super-secret-refresh-key-2026',
  JWT_EXPIRES_IN: '1d',
  JWT_REFRESH_EXPIRES_IN: '30d',
};
