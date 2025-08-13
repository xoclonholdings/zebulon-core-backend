# ZED AI Assistant - Server Setup & Mock Mode

## Current Status

The ZED AI Assistant is currently running in **Mock Mode** due to server startup issues. The authentication and chat functionality work through localStorage and mock responses.

## Mock Mode Features ✅

- **Authentication**: Login with `Admin` / `Zed2025`
- **Chat Interface**: Fully functional UI with mock ZED responses

## Switching to Production Server

To enable the full server functionality:

# ZED AI Assistant - Server Setup

Choose one of these server options:
The ZED AI Assistant is currently running due to server startup issues. The authentication and chat functionality work through localStorage and mock responses.
**Option A: TypeScript Server (Recommended)**
cd /home/xoclonholdings/Zebulon/Zed/AIAssist
```bash
```

**Option B: Node.js Server**
cd /home/xoclonholdings/Zebulon/Zed/AIAssist
```bash
cd /home/xoclonholdings/Zebulon/Zed/AIAssist
npm run simple
```

**Option C: Python Fallback Server**
cd /home/xoclonholdings/Zebulon/Zed/AIAssist
```bash
cd /home/xoclonholdings/Zebulon/Zed/AIAssist
python3 server-python.py
```

### 2. Disable Mock Mode

Update these files to set `USE_MOCK_AUTH = false`:
2. **client/src/pages/login.tsx** - Line ~25
1. **client/src/App.tsx** - Line ~36
2. **client/src/pages/login.tsx** - Line ~25
3. **client/src/hooks/use-chat-with-fallback.ts** - Line ~5

### 3. Test Server Connection
curl -X GET http://localhost:5000/api/health
```bash
curl -X GET http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Admin","password":"Zed2025"}'
```

## Server Architecture

### Authentication
- **Password**: `Zed2025`
- **Username**: `Admin`
- **Password**: `Zed2025`
- **Secondary Auth**: `XOCLON_SECURE_2025` (if enabled)

### API Endpoints
- `POST /api/login` - User authentication
- `GET /api/health` - Server health check
- `POST /api/login` - User authentication
- `GET /api/auth/user` - Current user info
- `POST /api/ask` - Unified ZED AI chat endpoint
- `POST /api/verify` - Secondary authentication
- Unified ZED identity across all AI responses
- **Ollama** → **OpenAI** → **Julius** fallback chain
### Common Issues
2. **Dependencies missing**: `npm install`
1. **Port 5000 in use**: `lsof -i :5000` then `kill <PID>`
2. **Dependencies missing**: `npm install`
## Development Notes
- Mock mode is designed for testing UI/UX without backend dependencies
- Mock mode is designed for testing UI/UX without backend dependencies
- All ZED responses maintain consistent branding and personality
- Production server includes full database integration and AI routing
- Session management uses express-session with proper security settings
---
**Status**: Mock Mode Active 🟡  
**Next Step**: Start server and disable mock mode flags  
**Contact**: Check server logs for detailed error information
