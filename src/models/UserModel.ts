import { query } from '../config/database';
import { User, UserCreateInput, UserResponse } from '../types';

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async create(input: UserCreateInput & { password: string }): Promise<UserResponse> {
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
      [input.name, input.email, input.password, input.role || 'contributor']
    );
    return result.rows[0];
  }
}
