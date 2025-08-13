import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Load .env and check required secrets
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const REQUIRED_SECRETS = [
  'DATABASE_URL',
  // Add more as needed
];

let missing = REQUIRED_SECRETS.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required secrets:', missing);
  process.exit(1);
}

console.log('All required secrets present.');

// Run Prisma migrate diff → migrate deploy (no destructive reset)
try {
  execSync('pnpm exec prisma migrate deploy', { stdio: 'inherit' });
} catch (e) {
  console.error('Prisma migration failed.');
  process.exit(1);
}

// Register and verify each template in order
const templates = [
  '01-universal-app',
  '02-data-automation',
  '03-commerce-payments',
  '04-notifications-reporting',
  '05-media-location',
];

for (const t of templates) {
  const modPath = `../templates/zync/${t}/index`;
  const mod = require(modPath);
  try {
    if (mod.register) {
      console.log(`Registering ${t}...`);
      await mod.register();
    }
    if (mod.verify) {
      console.log(`Verifying ${t}...`);
      await mod.verify();
    }
    console.log(`${t} installed and verified.`);
  } catch (err) {
    console.error(`${t} failed:`, err);
    // TODO: Rollback logic for this template
    process.exit(1);
  }
}

console.log('ZYNC install complete.');
// TODO: Output summary table, health, docs, admin, tools enabled
