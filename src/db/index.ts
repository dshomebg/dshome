import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Провери дали DATABASE_URL съществува
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined. Make sure .env.local exists and contains DATABASE_URL'
  );
}

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
