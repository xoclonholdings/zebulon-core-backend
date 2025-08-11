# Zebulon/Zed Netlify & Production Deployment Checklist

## 1. Environment Variables (Netlify)
- Go to your Netlify dashboard for each frontend (ZEBULON, Zync, Zed, etc).
- Add the following environment variable:
  - `DATABASE_URL=postgresql://neondb_owner:npg_dATI4Ek9fYtK@ep-fancy-fog-ae57mdja-pooler.c-2.us-east-2.aws.neon.tech/Zebulon-Oracle-Database?sslmode=require&channel_binding=require`
- For Zed backend, if deployed separately, ensure the same variable is set in its environment.

## 2. Remove Hardcoded Connection Strings
- Ensure all connection strings are loaded from environment variables, not hardcoded in code or schema.
- `.env` files should be used for local/dev only. Netlify/production must use dashboard env vars.

## 3. Build & Deploy
- Push your latest code to GitHub main branch.
- Netlify will auto-build and deploy the frontend(s).
- For backend (if not serverless), deploy to your server or use a Netlify Function/Edge Function if possible.

## 4. Zed Panel/Widget Integration
- In the main ZEBULON UI, ensure the Zed panel/component/widget is imported and rendered.
- The Zed panel should fetch from the correct backend URL:
  - Local/dev: `http://localhost:5000`
  - Production: `https://zed-ai.online` (or your backend domain)
- If using a widget/iframe, embed with the correct src.

## 5. CI/CD Automation
- Use GitHub Actions or Netlify CI for automated builds.
- Document all required environment variables in the repo README or this checklist.

## 6. Troubleshooting
- If Zed is not visible in production, check browser console for errors and Netlify logs for build/runtime errors.
- Ensure all environment variables are set and correct.
- Confirm backend is reachable from the frontend (CORS, network, etc).

---

**For further automation, add a Netlify `_redirects` file for API proxying if needed, and ensure all endpoints are reachable from the deployed frontend.**
