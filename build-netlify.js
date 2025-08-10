#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building ZED AI Assistant for Netlify deployment...');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/functions', { recursive: true });

// Build frontend
console.log('⚛️ Building React frontend...');
execSync('npm run build:frontend', { stdio: 'inherit' });

// Build backend for Netlify functions
console.log('🔧 Building backend for Netlify functions...');
execSync('npm run build:backend', { stdio: 'inherit' });

// Create Netlify function wrapper
console.log('🌐 Creating Netlify function wrapper...');
const netlifyFunction = `
const express = require('express');
const serverless = require('serverless-http');
const { createServer } = require('./index.js');

const app = express();
const server = createServer(app);

module.exports.handler = serverless(app);
`;

fs.writeFileSync('dist/functions/server.js', netlifyFunction);

// Copy necessary files
console.log('📁 Copying configuration files...');
const filesToCopy = [
  'package.json',
  'netlify.toml',
  '.env.example'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
  }
});

// Create deployment instructions
const deployInstructions = `
# ZED AI Assistant - Netlify Deployment

## Quick Deploy
1. Upload the 'dist' folder to Netlify
2. Set environment variables:
   - DATABASE_URL: Your PostgreSQL connection string
   - OPENAI_API_KEY: Your OpenAI API key
   - SESSION_SECRET: Random secure string for sessions

## Manual Deploy
1. Connect your repository to Netlify
2. Set build command: npm run build:netlify
3. Set publish directory: dist/public
4. Add environment variables in Netlify dashboard

## Local Testing
- npm run dev (development)
- npm run build:netlify (production build)
- npm run preview (test production build)

The app runs independently of Replit services and is fully exportable.
`;

fs.writeFileSync('dist/README-DEPLOY.md', deployInstructions);

console.log('✅ Build complete! Ready for Netlify deployment.');
console.log('📂 Files are in the "dist" directory');
console.log('📝 See dist/README-DEPLOY.md for deployment instructions');