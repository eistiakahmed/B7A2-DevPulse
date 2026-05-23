import { Request, Response, NextFunction } from 'express';
import { HttpStatus, ValidationRule } from '../types';
import { validateRequest } from '../utils/validators';
import { errorResponse } from '../utils/response';

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = validateRequest(rules, req.body);

    if (!result.valid) {
      errorResponse(res, {
        message: 'Validation failed',
        errors: result.errors.join(', ')
      }, HttpStatus.BAD_REQUEST);
      return;
    }

    next();
  };
};
