import { Request } from 'express';
import { JwtPayload } from './auth.types';

// Extended Express Request Types
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RequestWithUser extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  body: any;
  params: any;
  query: any;
}

// Validation Types
export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  email?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
