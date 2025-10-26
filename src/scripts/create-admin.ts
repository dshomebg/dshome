import * as dotenv from 'dotenv';

// Зареди .env.local ПЪРВО
dotenv.config({ path: '.env.local' });

// DEBUG
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// СЛЕД ТОВА импортирай db (за да вземе правилния URL)
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../db/schema';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    // Създай connection директно тук
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { users } });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: 'admin@dshome.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created!');
    console.log('Email: admin@dshome.com');
    console.log('Password: admin123');
    
    await client.end();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
  process.exit(0);
}

createAdmin();
