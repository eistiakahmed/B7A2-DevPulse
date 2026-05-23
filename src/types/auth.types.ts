import { UserRole } from './user.types';

// JWT Types
export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Auth Response Types
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
  };
}
