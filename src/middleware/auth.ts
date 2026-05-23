import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import { HttpStatus, RequestWithUser } from '../types';

type AuthRequest = RequestWithUser;

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, {
        message: 'Access token is required',
        errors: 'Missing or invalid Authorization header'
      }, HttpStatus.UNAUTHORIZED);
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (error) {
      errorResponse(res, {
        message: 'Invalid or expired token',
        errors: 'Please login again'
      }, HttpStatus.UNAUTHORIZED);
    }
  } catch (error) {
    errorResponse(res, {
      message: 'Authentication failed',
      errors: error instanceof Error ? error.message : 'Unknown error'
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, {
        message: 'Authentication required',
        errors: 'Please login to access this resource'
      }, HttpStatus.UNAUTHORIZED);
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(res, {
        message: 'Insufficient permissions',
        errors: `This action requires one of the following roles: ${roles.join(', ')}`
      }, HttpStatus.FORBIDDEN);
      return;
    }

    next();
  };
};
