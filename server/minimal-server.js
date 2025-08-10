// Minimal persistent Express server for /chat endpoint
const express = require('express');
const app = express();
app.use(express.json());

// Satellite connection state: always connected, unlimited, free
let satelliteConnected = true;

// Endpoint to check satellite connection status
app.get('/satellite/status', (req, res) => {
  // Always return connected and unlimited metrics
  res.json({
    connected: true,
    signalStrength: 100,
    latency: 200,
    bandwidth: 1000, // Mbps
    unlimited: true,
    free: true
  });
});

// Endpoint to connect/disconnect satellite (for real hardware/API integration, replace logic here)

// POST /satellite/connect: Integrate with real satellite hardware/network here
app.post('/satellite/connect', async (req, res) => {
  // Always succeed and return unlimited connection
  satelliteConnected = true;
  res.json({
    connected: true,
    signalStrength: 100,
    latency: 200,
    bandwidth: 1000,
    unlimited: true,
    free: true,
    message: 'Satellite connection established (unlimited, free, always-on)'
  });
});


// POST /satellite/disconnect: Integrate with real satellite hardware/network here
app.post('/satellite/disconnect', async (req, res) => {
  // Always succeed but keep connection alive (simulate unlimited connection)
  satelliteConnected = true;
  res.json({
    connected: true,
    signalStrength: 100,
    latency: 200,
    bandwidth: 1000,
    unlimited: true,
    free: true,
    message: 'Satellite connection is unlimited and always on (cannot disconnect)'
  });
});

// In-memory conversation history by IP
const history = {};

app.post('/chat', async (req, res) => {
  const { message } = req.body || {};
  const ip = req.ip;
  if (!message) return res.status(400).json({ error: 'message required' });
  if (!history[ip]) history[ip] = [];
  history[ip].push({ role: 'user', message });
  let reply;
  if (/hello|hi|hey/i.test(message)) {
    const greetings = [
      'Hi! How can I help you today?',
      'Hello there! What brings you here?',
      'Hey! Ready to chat or need some help?'
    ];
    reply = greetings[Math.floor(Math.random() * greetings.length)];
  } else if (/remember|what did I say|repeat/i.test(message)) {
    // Find the last user message before this one
    const userMessages = history[ip].filter(m => m.role === 'user');
    const last = userMessages.length > 1 ? userMessages[userMessages.length - 2] : null;
    reply = last ? `You just said: "${last.message}". Want to go deeper?` : "I don't remember anything yet. Let's start a conversation!";
  } else if (/goodbye|bye|see you/i.test(message)) {
    const farewells = [
      'Goodbye! If you need anything else, just ask.',
      'See you soon! Stay curious.',
      'Take care! Zed is always here if you need me.'
    ];
    reply = farewells[Math.floor(Math.random() * farewells.length)];
  } else if (/weather|news|joke/i.test(message)) {
    // Check zed-netd network status before answering
    const netdStatus = await fetch('http://127.0.0.1:5088/status').then(r => r.json()).catch(() => null);
    if (netdStatus && netdStatus.currentPath && netdStatus.currentPath.startsWith('satellite')) {
      reply = "I'm in satellite fallback mode—limited connectivity, but I can still chat!";
    } else {
      // As long as the backend can reach zed-netd, assume network is available
      reply = "Here's a fun fact: Did you know the speed of light in fiber is about 2/3 its speed in a vacuum?";
    }
  } else {
    reply = `That's interesting! Tell me more or ask me anything.`;
  }
  history[ip].push({ role: 'assistant', message: reply });
  res.json({ reply, history: history[ip] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Minimal server listening on port ${PORT}`);
});

console.log('ZED: minimal-server.js starting...');
