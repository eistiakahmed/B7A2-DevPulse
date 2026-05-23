import { Response } from 'express';
import { errorResponse } from './response';
import { HttpStatus } from '../types';

export const notFoundResponse = (
  res: Response,
  resourceName: string,
  resourceId?: string | number
): void => {
  const message = resourceId
    ? `No ${resourceName} found with id ${resourceId}`
    : `${resourceName} not found`;

  errorResponse(res, {
    message,
    errors: resourceId ? `Resource ${resourceId} does not exist` : 'Resource not found'
  }, HttpStatus.NOT_FOUND);
};

export const accessDeniedResponse = (
  res: Response,
  reason: string
): void => {
  errorResponse(res, {
    message: 'Access denied',
    errors: reason
  }, HttpStatus.FORBIDDEN);
};

export const validationFailedResponse = (
  res: Response,
  errors: string | string[]
): void => {
  const errorsString = Array.isArray(errors) ? errors.join(', ') : errors;

  errorResponse(res, {
    message: 'Validation failed',
    errors: errorsString
  }, HttpStatus.BAD_REQUEST);
};

export const missingFieldsResponse = (
  res: Response,
  fields: string[]
): void => {
  errorResponse(res, {
    message: 'Missing required fields',
    errors: `${fields.join(', ')} are required`
  }, HttpStatus.BAD_REQUEST);
};

export const conflictResponse = (
  res: Response,
  resourceName: string,
  conflictingField: string
): void => {
  errorResponse(res, {
    message: `${resourceName} already exists`,
    errors: `A ${resourceName} with this ${conflictingField} already exists`
  }, HttpStatus.CONFLICT);
};

export const unauthorizedResponse = (
  res: Response,
  message: string = 'Authentication required'
): void => {
  errorResponse(res, {
    message,
    errors: 'Please login to access this resource'
  }, HttpStatus.UNAUTHORIZED);
};

export const invalidCredentialsResponse = (res: Response): void => {
  errorResponse(res, {
    message: 'Invalid credentials',
    errors: 'Email or password is incorrect'
  }, HttpStatus.UNAUTHORIZED);
};

export const serverErrorResponse = (
  res: Response,
  operation: string,
  error?: Error
): void => {
  console.error(`${operation} error:`, error);

  errorResponse(res, {
    message: `${operation} failed`,
    errors: error?.message || 'Unknown error'
  }, HttpStatus.INTERNAL_SERVER_ERROR);
};
