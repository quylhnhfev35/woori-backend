import dotenv from 'dotenv';

dotenv.config();

// Định nghĩa type cho env
interface IEnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

// Export object config đã parse
export const envConfig: IEnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: (process.env.NODE_ENV as IEnvConfig['NODE_ENV']) || 'development',
};