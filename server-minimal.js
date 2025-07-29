const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

// Simple session storage (in memory)
const sessions = new Map();

function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substr(2, 9);
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function sendJSON(res, statusCode, data) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(req, res, pathname) {
  // Determine the file path
  let filePath = path.join(__dirname, 'client/dist', pathname === '/' ? 'index.html' : pathname);
  
  // Security check - prevent directory traversal
  const clientDistPath = path.join(__dirname, 'client/dist');
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(clientDistPath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, serve index.html for SPA routing
      filePath = path.join(__dirname, 'client/dist/index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }

      // Determine content type
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';

      setCORSHeaders(res);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'ZED Minimal Server'
    });
    return;
  }

  // Login endpoint
  if (pathname === '/api/login' && method === 'POST') {
    const body = await parseBody(req);
    const { username, password } = body;

    console.log(`Login attempt: ${username}`);

    if (username === 'Admin' && password === 'Zed2025') {
      const sessionId = generateSessionId();
      sessions.set(sessionId, { username, verified: false });
      
      res.setHeader('Set-Cookie', `zed_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
      sendJSON(res, 200, { success: true, message: 'Login successful' });
      console.log('✅ Login successful');
      return;
    }

    sendJSON(res, 401, { success: false, reason: 'Invalid credentials' });
    console.log('❌ Invalid credentials');
    return;
  }

  // Get current user
  if (pathname === '/api/auth/user' && method === 'GET') {
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionId = cookies.zed_session;
    const session = sessions.get(sessionId);

    if (session) {
      sendJSON(res, 200, {
        user: { username: session.username },
        verified: session.verified
      });
    } else {
      sendJSON(res, 401, { error: 'Not authenticated' });
    }
    return;
  }

  // Chat endpoint
  if (pathname === '/api/ask' && method === 'POST') {
    const body = await parseBody(req);
    const { content, message } = body;
    const userMessage = content || message || '';

    console.log(`Chat message: ${userMessage}`);

    sendJSON(res, 200, {
      message: `ZED: Hello! You said "${userMessage}". The minimal server is working correctly!`,
      timestamp: new Date().toISOString(),
      source: 'ZED_MINIMAL'
    });
    return;
  }

  // Serve static files for everything else
  serveStaticFile(req, res, pathname);
});

function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) cookies[name] = value;
    });
  }
  return cookies;
}

const PORT = 5000;

server.listen(PORT, () => {
  console.log('🚀 ZED Full-Stack Server started successfully!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log('🌐 Frontend available at http://localhost:5000');
  console.log('📝 Login credentials: Admin / Zed2025');
  console.log('🔒 API Authentication: /api/login');
  console.log('💬 API Chat: /api/ask');
  console.log('📊 API Health: /api/health');
  console.log('📁 Static files: client/dist/');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the process and try again.`);
    process.exit(1);
  }
});
