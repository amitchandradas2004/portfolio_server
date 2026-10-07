import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_key_12345',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};
