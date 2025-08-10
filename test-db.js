#!/usr/bin/env node
import "dotenv/config";
import { Pool } from '@neondatabase/serverless';

console.log("🔍 Testing database connection...");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Not set");

try {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query('SELECT NOW()');
  console.log("✅ Database connection successful:", result.rows[0]);
} catch (error) {
  console.error("❌ Database connection error:", error.message);
}

console.log("✅ Test completed");
