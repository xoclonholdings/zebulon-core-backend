const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5000"],
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: "zed_development_secret_2025",
  resave: false,
  saveUninitialized: false,
  name: "zed_session",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Authentication endpoints
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username}`);
  
  if (username === "Admin" && password === "Zed2025") {
    req.session.user = { username };
    req.session.verified = false;
    console.log("✅ Login successful");
    return res.json({ success: true, message: "Login successful" });
  }
  
  console.log("❌ Invalid credentials");
  res.status(401).json({ success: false, reason: "Invalid credentials" });
});

app.get("/api/auth/user", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ 
      user: req.session.user,
      verified: req.session.verified || false 
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/api/verify", (req, res) => {
  const { username, method, phrase } = req.body;
  if (
    req.session.user &&
    username === "Admin" &&
    method === "secure_phrase" &&
    phrase === "XOCLON_SECURE_2025"
  ) {
    req.session.verified = true;
    return res.json({ success: true, message: "Secondary authentication passed" });
  }
  res.status(401).json({ success: false, reason: "Secondary authentication failed" });
});

// Simple chat endpoint
app.post("/api/ask", (req, res) => {
  const { message } = req.body;
  console.log(`Chat message: ${message}`);
  
  res.json({
    message: `ZED: Hello! You said "${message}". The server is working correctly!`,
    timestamp: new Date().toISOString(),
    source: "ZED_SIMPLE"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    server: "ZED Simple Server"
  });
});

// Serve static files from client/dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 ZED Simple Server started successfully!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log('📝 Login credentials: Admin / Zed2025');
  console.log('🔒 Authentication ready at /api/login');
  console.log('💬 Chat ready at /api/ask');
  console.log('📊 Health check at /api/health');
});
