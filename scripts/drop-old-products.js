const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function dropOldProducts() {
  const client = await pool.connect();

  try {
    console.log('Dropping old products table...');
    await client.query('DROP TABLE IF EXISTS products CASCADE');
    console.log('✓ Old products table dropped successfully!');
  } catch (error) {
    console.error('Error dropping products table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

dropOldProducts();
