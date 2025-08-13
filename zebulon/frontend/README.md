# Zebulon Frontend

## Development
- `npm run dev` — Start frontend (Next.js)
- `npm run desktop` — Start desktop app (Electron)

## Environment
- `.env.local` — Set `API_BASE_URL` for backend

## Build
- `npm run build` — Build production frontend
- `npm run start` — Serve production frontend

## Desktop Packaging
- `npm run desktop` — Launch Electron app
- Icon: `public/icon.png`

---

# Zebulon Backend

## Development
- `npm run dev` — Start backend (Express)
- `.env` — Set `PORT` and `FRONTEND_URL`

## Build/Deploy
- Dockerfile provided for fullstack container

---

# Auto-Startup
- `node ../start-all.js` — Runs backend, then frontend

---

# Desktop App Installers
- Use Electron builder or Tauri for `.exe`, `.dmg`, `.AppImage` (future step)

---

# Tile Functionality Checklist
- See deployment instructions for tile testing and reporting.
