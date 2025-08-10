// server-simple.cjs
// CommonJS version of server-simple.js for dev:simple script
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// --- CORS configuration for Netlify frontend and custom API domain ---
const allowedOrigins = [
  'https://zebulonhub.xyz',
  'https://www.zebulonhub.xyz'
];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// --- Health check route (always reachable) ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

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

// Simple chat endpoint (now with real AI)
app.post("/api/ask", async (req, res) => {
  const { message, mode } = req.body;
  console.log(`Chat message: ${message}`);

  // Dynamically import ESM modules for OpenAI/Ollama
  let answer = '';
  try {
    if (mode === 'agent') {
      // Hardcoded OpenAI API call (gpt-4o)
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const OPENAI_API_KEY = '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'; // <-- HARDCODED FROM .env
      if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-REPLACE_WITH_YOUR_KEY') {
        answer = '[ZED Error] OpenAI API key missing.';
      } else {
        const url = 'https://api.openai.com/v1/chat/completions';
        const payload = {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are ZED, a helpful AI assistant.' },
            { role: 'user', content: message }
          ],
          max_tokens: 512,
          temperature: 0.7
        };
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) {
          // Fallback to Ollama agent model if OpenAI fails
          const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
          const ollamaPayload = {
            model: 'llama3-agent',
            messages: [
              { role: 'system', content: 'You are ZED, a helpful AI assistant.' },
              { role: 'user', content: message }
            ],
            stream: false
          };
          try {
            const ollamaResp = await fetch(OLLAMA_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ollamaPayload)
            });
            if (!ollamaResp.ok) {
              answer = `[ZED Error] OpenAI error: ${resp.statusText}; Ollama agent error: ${ollamaResp.statusText}`;
            } else {
              const ollamaData = await ollamaResp.json();
              answer = ollamaData?.message?.content || '[ZED Error] No answer from Ollama agent.';
            }
          } catch (ollamaErr) {
            answer = '[ZED Error] Both OpenAI and Ollama agent unavailable.';
          }
        } else {
          const data = await resp.json();
          answer = data.choices?.[0]?.message?.content || '[ZED Error] No answer from OpenAI.';
        }
      }
    } else {
      // Hardcoded Ollama API call (llama3)
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
      const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
      const payload = {
        model: 'llama3',
        messages: [
          { role: 'user', content: message }
        ],
        stream: false
      };
      try {
        const resp = await fetch(OLLAMA_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) {
          answer = `[ZED Error] Ollama error: ${resp.statusText}`;
        } else {
          const data = await resp.json();
          answer = data?.message?.content || '[ZED Error] No answer from Ollama.';
        }
      } catch (err) {
        answer = '[ZED Error] Ollama server not reachable.';
      }
    }
  } catch (err) {
    console.error('AI error:', err);
    answer = '[ZED Error] Sorry, I could not process your request.';
  }
  res.json({
    message: answer,
    timestamp: new Date().toISOString(),
    source: mode === 'agent' ? 'ZED_AGENT' : 'ZED_OLLAMA'
  });
});

// (Legacy) Health check for compatibility
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
  console.log('🚀 Zebulon Core API started successfully!');
  console.log('Allowed origins:', allowedOrigins);
  console.log(`API base URL: http://localhost:${PORT}`);
  console.log('📊 Health check at /health');
});
