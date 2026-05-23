import { Response } from 'express';
import { AuthService } from '../services/authService';
import { successResponse } from '../utils/response';
import { validateEmail, validatePassword } from '../utils/validationHelpers';
import { serverErrorResponse, conflictResponse, validationFailedResponse, invalidCredentialsResponse, missingFieldsResponse } from '../utils/errorResponses';
import { HttpStatus, RequestWithUser } from '../types';

export const signup = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      missingFieldsResponse(res, ['Name', 'email', 'password']);
      return;
    }

    if (!validateEmail(email)) {
      validationFailedResponse(res, 'Please provide a valid email address');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      validationFailedResponse(res, passwordValidation.errors);
      return;
    }

    const authResponse = await AuthService.register({
      name,
      email,
      password,
      role
    });

    successResponse(res, {
      message: 'User registered successfully',
      data: authResponse.user
    }, HttpStatus.CREATED);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        conflictResponse(res, 'User', 'email');
        return;
      }

      if (error.message === 'Invalid role') {
        validationFailedResponse(res, 'Role must be either contributor or maintainer');
        return;
      }
    }

    serverErrorResponse(res, 'Registration', error as Error);
  }
};

export const login = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      missingFieldsResponse(res, ['Email', 'password']);
      return;
    }

    const authResponse = await AuthService.login({ email, password });

    successResponse(res, {
      message: 'Login successful',
      data: authResponse
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      invalidCredentialsResponse(res);
      return;
    }

    serverErrorResponse(res, 'Login', error as Error);
  }
};
