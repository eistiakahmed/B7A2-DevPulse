import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const getClient = (): Promise<PoolClient> => pool.connect();

export default pool;
