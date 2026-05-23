import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { HttpStatus } from '../types';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  if (error.message.includes('duplicate key')) {
    errorResponse(res, {
      message: 'Resource already exists',
      errors: 'A record with this information already exists'
    }, HttpStatus.CONFLICT);
    return;
  }

  errorResponse(res, {
    message: 'Internal server error',
    errors: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
  }, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, {
    message: 'Resource not found',
    errors: `Cannot ${req.method} ${req.path}`
  }, HttpStatus.NOT_FOUND);
};
