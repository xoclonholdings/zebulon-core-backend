<<<<<<< HEAD
# Zebulon
=======
# How to run locally

1. Install dependencies:
     ```bash
     npm install
     ```
2. Copy `.env.example` to `.env` and fill in secrets as needed.
3. Start the backend:
     ```bash
     npm run dev
     # or for production build
     npm run build && npm start
     ```
4. The backend will listen on `http://localhost:3001` by default.

# Railway deployment

Set these environment variables in Railway:

- `PORT=3001` (Railway will set this automatically)
- `SSL_KEY` and `SSL_CERT` (PEM string or file path, for HTTPS on 5001)
- `ALLOWED_ORIGINS=http://localhost:5173,https://zed-ai.online,https://*.netlify.app`

# Vite frontend config

In your Vite app, set:

- `VITE_API_BASE=http://localhost:3001` (for local dev)
- `VITE_API_BASE=https://<your-railway-domain>:5001` (for production, HTTPS)

The backend CORS allow-list is:

- `http://localhost:5173`
- `https://zed-ai.online`
- `https://*.netlify.app`

The backend exposes `Authorization` and `Content-Type` headers for frontend access.
# ZED AI Assistant

ZED is an advanced AI assistant with comprehensive file processing capabilities, multi-tier memory system, and enterprise-grade security features designed for XOCLON HOLDINGS INC.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Configure your environment variables in .env
# 4. Run health check
./scripts/health-check.sh

# 5. Start development server
npm run dev
```

**Production API Base URL:** https://zed-backend-production.up.railway.app
## Public API Endpoints

**Health and Diagnostics:**

- `GET /` → plain text: `zed-backend online`
- `GET /health`, `GET /healthz`, `GET /status` → `{ ok: true, service: 'zed-backend' }`

**Chat API:**

- `POST /api/ask` → `{ ok: true, service: 'zed-backend', echo: [messages] }` (always returns JSON, handles missing body)

**CORS:**

- Allowed origins: `https://zed-ai.online`, `http://localhost:5173`
- Allowed methods: `GET, POST, OPTIONS`
- Allowed headers: `Content-Type, Authorization`

## Features

### 🔐 Advanced Security

- Multi-factor admin verification with device fingerprinting
- Secure phrase override system (XOCLON_SECURE_2025)
- Session-based authentication with 45-minute auto-expiry
- Challenge recovery system with logic puzzles

### 🧠 Three-Tier Memory System

- **Core Memory**: Persistent admin-only personality and rules
- **Project Memory**: Saved user context and project-specific data
- **Scratchpad Memory**: Temporary daily memory with auto-reset

### 📁 Advanced File Processing

- Support for .pdf, .docx, .txt, .zip files up to 32GB
- Automatic ZIP extraction and content analysis
- DOCX text extraction with OpenAI integration
- Real-time file processing status tracking

### 🎨 Cyberpunk Interface

- Dark theme with purple-cyan-pink gradients
- Animated backgrounds and floating effects
- Responsive design with glassmorphism effects
- Real-time chat with streaming responses

### 👥 User Management (Admin Only)

- Full CRUD operations for user accounts
- User statistics dashboard
- Role-based access control
- Profile management with avatar generation

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone and Install**

```bash
git clone <repository-url>
cd zed-ai-assistant
npm install
```

2. **Environment Setup**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**

```bash
npm run db:push
```

4. **Start Development Server**

```bash
npm run dev
```

5. **Access Application**

- Open http://localhost:5001
- Login with your configured credentials

## Production Deployment

### Netlify Deployment

1. **Build for Production**

```bash
npm run build:netlify
```

2. **Deploy to Netlify**

- Upload the generated `dist/` folder to Netlify
- Configure environment variables in Netlify dashboard
- Set build command: `npm run build:netlify`
- Set publish directory: `dist`

### Manual Deployment

1. **Build Application**

```bash
npm run build
```

2. **Start Production Server**

```bash
NODE_ENV=production npm start
```

## Configuration

### Required Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/db
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=secure_random_string
ADMIN_USERNAME=*****
ADMIN_PASSWORD=*****
ADMIN_SECURE_PHRASE=********
```

### Admin Access

Admin users have access to:

- User management panel
- Core memory editing
- System statistics
- Advanced security features

## File Support

### Supported Formats

- **Documents**: .pdf, .docx, .txt
- **Archives**: .zip (auto-extracted)
- **Data**: .json, .csv
- **Images**: .jpg, .png, .gif, .webp
- **Code**: .js, .ts, .py, .java, etc.

### File Size Limits

- Individual files: Up to 32GB
- ZIP archives: Unlimited (extracted contents processed)
- Batch uploads: Multiple files supported

## Security Features

### Multi-Factor Authentication

1. Primary username/password
2. Device fingerprinting
3. Secure phrase override
4. Challenge recovery system

### Session Management

- 45-minute session timeout
- Automatic device verification
- Trusted device tracking
- Activity-based session extension


## Legacy/Advanced API Endpoints

## Memory System

### Core Memory

- Loaded from `core.memory.json` on startup
- Contains personality, tone, and behavioral rules
- Only editable by Admin users
- Persistent across restarts

### Project Memory

- User-specific project context
- Searchable by name/keyword
- Automatically saved during conversations
- Categorized by project type

### Scratchpad Memory

- Temporary daily memory
- Auto-resets every 24 hours
- Used for session-specific context
- Garbage collected automatically

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # Business logic
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database layer
│   └── localAuth.ts       # Authentication
├── shared/                # Shared types
│   └── schema.ts          # Database schema
└── uploads/               # File storage
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:netlify` - Build for Netlify
- `npm run db:push` - Update database schema
- `npm start` - Start production server

## Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify DATABASE_URL format
postgresql://user:password@host:port/database
```

**OpenAI API Error**

```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

**File Upload Issues**

- Check upload directory permissions
- Verify file size limits
- Ensure supported file types

### Performance Optimization

The application includes automatic optimization:

- Memory cache with LRU eviction
- Database connection pooling
- Automated cleanup every 15 minutes
- File chunking for large uploads

## Support

For support or questions:

1. Check the troubleshooting section
2. Review server logs for errors
3. Verify environment configuration
4. Contact system administrator

## License

Proprietary software for XOCLON HOLDINGS INC.
All rights reserved.
>>>>>>> d1a6b5690cb748e3c7d5e957460e093f3d9db20e
