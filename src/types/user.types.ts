// User Entity Types
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = 'contributor' | 'maintainer';

// User Input Types
export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

// User Response Types
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
