import { MongoClient, Db } from 'mongodb';
import { env } from './env.config';
import { logger } from '../utils/logger';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionPromise: Promise<boolean> | null = null;

const getDatabaseName = (uri: string): string => {
  try {
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    return process.env.DB_NAME || (match && match[1] ? match[1] : 'portfolio');
  } catch {
    return process.env.DB_NAME || 'portfolio';
  }
};

export const connectDB = async (): Promise<boolean> => {
  if (db && client) return true;
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      client = new MongoClient(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      await client.connect();
      
      const dbName = getDatabaseName(env.MONGODB_URI);
      db = client.db(dbName);

      logger.success(`MongoDB Connected via Native Driver: ${db.databaseName}`);
      return true;
    } catch (error: any) {
      logger.warn(`MongoDB Native Connection Failed: ${error.message}`);
      client = null;
      db = null;
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first or ensure MongoDB is running.');
  }
  return db;
};

export const isDbReady = (): boolean => {
  return db !== null;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
