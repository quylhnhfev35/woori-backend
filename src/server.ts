import { createApp } from './app';
import { connectDB } from './config/db';
import { envConfig } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();

    app.listen(envConfig.PORT, () => {
      logger.info(`Server is running on port ${envConfig.PORT}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();