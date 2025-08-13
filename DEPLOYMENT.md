# Full-Stack Production Deployment Guide (TypeScript Backend + Frontend)

## Backend (Railway)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Pre-build TypeScript:**
   ```bash
   npm run build
   # Compiles TypeScript to JS in dist/
   ```
3. **Deploy only built artifacts:**
   - Ensure `dist/` is included in your deployment.
   - Use `npm start` to launch instantly:
     ```bash
     npm start
     # Runs node dist/server/index.js
     ```
4. **Production optimization:**
   - Only runtime dependencies are included in production.
   - Dev dependencies are used for build only.

## Frontend (Netlify)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Pre-build frontend:**
   ```bash
   npm run build
   # Compiles frontend to dist/
   ```
3. **Deploy only built artifacts:**
   - Ensure `dist/` is included in your deployment.
   - Use `npm start` to serve instantly:
     ```bash
     npm start
     # Serves dist/ using vite preview
     ```
4. **SPA Routing & API Proxy:**
   - SPA fallback and API proxy are configured in `netlify.toml` and `client/public/_redirects`.
   - `/api/*` requests are proxied to https://api.zebulonhub.xyz.

## General Notes
- **No build steps in production containers.**
- **Pre-build everything locally or in CI.**
- **Deploy only compiled JS and static assets.**
- **Comments in config files explain each step and optimization.**
