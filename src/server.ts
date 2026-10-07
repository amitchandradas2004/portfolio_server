import app from './app';
import { env } from './config/env.config';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  const isDbConnected = await connectDB();

  // Only start standalone HTTP listener when not running in Vercel serverless
  if (!process.env.VERCEL) {
    const PORT = env.PORT;
    app.listen(PORT, () => {
      logger.success(`Server is running on port ${PORT} (${env.NODE_ENV} mode)`);
      logger.info(`URL: http://localhost:${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
      if (!isDbConnected) {
        logger.warn('Database: MongoDB disconnected');
      } else {
        logger.success('Database: MongoDB connected');
      }
    });
  }
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
});

export default app;
