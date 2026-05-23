import bcrypt from 'bcrypt';
import { UserModel } from '../models/UserModel';
import { generateToken } from '../utils/jwt';
import { UserCreateInput, UserLoginInput, AuthResponse, UserRole } from '../types';

export class AuthService {
  static async register(input: UserCreateInput): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(input.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const validRoles: UserRole[] = ['contributor', 'maintainer'];
    if (input.role && !validRoles.includes(input.role)) {
      throw new Error('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await UserModel.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role || 'contributor'
    });

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user
    };
  }

  static async login(input: UserLoginInput): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(input.email);

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    };
  }
}
