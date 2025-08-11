const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const MIGRATION = process.argv[2];
if (!MIGRATION) {
  console.error('Usage: node migrate.js <migration.sql>');
  process.exit(1);
}

const sql = fs.readFileSync(path.resolve(MIGRATION), 'utf8');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration applied:', MIGRATION);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
