// Minimal persistent Express server for /chat endpoint
const express = require('express');
const app = express();
app.use(express.json());

// In-memory conversation history by IP
const history = {};

app.post('/chat', (req, res) => {
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
    reply = "I'm not connected to the internet, but I can always offer a fun fact or a friendly chat!";
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
