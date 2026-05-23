import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '../types';

export const successResponse = (res: Response, data: Omit<SuccessResponse, 'success'>, statusCode: number = 200): void => {
  res.status(statusCode).json({
    success: true,
    ...data
  });
};

export const errorResponse = (res: Response, data: Omit<ErrorResponse, 'success'>, statusCode: number = 400): void => {
  res.status(statusCode).json({
    success: false,
    ...data
  });
};
