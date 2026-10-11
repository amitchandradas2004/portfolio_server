import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env.config';
import apiRouter from './routes';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware';

import { connectDB, isDbReady } from './config/db';

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: env.CLIENT_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Portfolio API Server',
    health: '/api/health',
  });
});

// Explicit health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Portfolio Server is operational',
    dbConnected: isDbReady(),
    timestamp: new Date().toISOString(),
  });
});

// Ensure DB connection for serverless environments (e.g. Vercel)
app.use(async (_req, _res, next) => {
  if (!isDbReady()) {
    await connectDB();
  }
  next();
});

// API routes
app.use('/api', apiRouter);

// 404 & Global Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
