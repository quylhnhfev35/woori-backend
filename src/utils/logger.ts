import { createLogger, format, transports } from 'winston';
import { envConfig } from '../config/env';

const { combine, timestamp, printf, colorize } = format;

// Format log
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Tạo logger
export const logger = createLogger({
  level: envConfig.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  ],
});
