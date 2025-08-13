import http from 'http';
import url from 'url';
import querystring from 'querystring';
import { spawn } from 'child_process';

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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function sendJSON(res, statusCode, data) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function proxyToVite(req, res) {
  const options = {
    hostname: 'localhost',
    port: 5173,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    console.log('Vite proxy error:', err.message);
    res.writeHead(502, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>ZED AI Assistant</title></head>
        <body style="background: #000; color: #fff; font-family: Arial; padding: 40px; text-align: center;">
          <h1>ZED AI Assistant</h1>
          <p>Starting up Vite development server...</p>
          <p>Please wait a moment and refresh the page.</p>
          <script>setTimeout(() => location.reload(), 3000);</script>
        </body>
      </html>
    `);
  });

  req.pipe(proxy);
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

  // API endpoints
  if (pathname.startsWith('/api/')) {
    // Health check
    if (pathname === '/api/health' && method === 'GET') {
      sendJSON(res, 200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'ZED Hybrid Server',
        frontend: 'Vite Dev Server',
        backend: 'Node.js'
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
        message: `ZED: Hello! You said "${userMessage}". The hybrid server is working correctly with full frontend integration!`,
        timestamp: new Date().toISOString(),
        source: 'ZED_HYBRID'
      });
      return;
    }

    // API endpoint not found
    sendJSON(res, 404, { error: 'API endpoint not found' });
    return;
  }

  // Everything else goes to Vite dev server
  proxyToVite(req, res);
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

// Start Vite dev server
console.log('🔧 Starting Vite development server...');
const viteProcess = spawn('npx', ['vite', '--port', '5173', '--host'], {
  cwd: '/home/xoclonholdings/Zebulon/Zed/AIAssist',
  stdio: 'pipe'
});

viteProcess.stdout.on('data', (data) => {
  console.log(`[Vite] ${data.toString().trim()}`);
});

viteProcess.stderr.on('data', (data) => {
  console.error(`[Vite Error] ${data.toString().trim()}`);
});

// Start the API server
const PORT = 5001;

setTimeout(() => {
  server.listen(PORT, () => {
    console.log('🚀 ZED Hybrid Server started successfully!');
    console.log(`📡 Full application running on http://localhost:${PORT}`);
    console.log('🎨 Frontend: Vite Dev Server (proxied from :5173)');
    console.log('🔧 Backend: Node.js API Server');
    console.log('📝 Login credentials: Admin / Zed2025');
    console.log('🔒 API Authentication: /api/login');
    console.log('💬 API Chat: /api/ask');
    console.log('📊 API Health: /api/health');
  });
}, 3000); // Wait 3 seconds for Vite to start

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the process and try again.`);
    process.exit(1);
  }
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  viteProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  viteProcess.kill();
  process.exit(0);
});
