// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import morgan from "morgan";
import { errorHandler } from './middlewares/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middleware parse JSON body
  app.use(express.json());

  // Bật CORS cho frontend
  app.use(cors());

  // Thêm header bảo mật
  app.use(helmet());

  app.use(morgan(":method :url :status :response-time ms"));

  // Mount routes
  app.use('/api', routes);

  // Middleware bắt lỗi đặt cuối cùng
  app.use(errorHandler);

  return app;
};