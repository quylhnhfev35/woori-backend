import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env';

export interface JwtPayload {
  userId: string;
  user_name: string;
}

const JWT_SECRET = envConfig.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Tạo access token
export const signToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn: any = JWT_EXPIRES_IN || '1h';

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Verify token
export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};