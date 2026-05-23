import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
