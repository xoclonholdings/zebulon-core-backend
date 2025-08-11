import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
import { json } from 'body-parser';
app.use(json());

// JWT Auth middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    const token = auth.replace('Bearer ', '');
  (req as any).user = jwt.verify(token, process.env.MEMORY_JWT_SECRET || 'change_me');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});


// In-memory persistent core partition (for demo; replace with DB in prod)
const coreMemory: Record<string, { content: string, created: number }[]> = {};

// Get persistent core memory for current user
app.get('/api/memory/core', (req, res) => {
  const userId = (req as any).user?.sub || (req as any).user?.id || (req as any).user?.username || 'unknown';
  res.json({ items: coreMemory[userId] || [] });
});

// Add to persistent core memory for current user
app.post('/api/memory/core', (req, res) => {
  const userId = req.user?.sub || req.user?.id || req.user?.username || 'unknown';
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  if (!coreMemory[userId]) coreMemory[userId] = [];
  coreMemory[userId].push({ content, created: Date.now() });
  res.json({ ok: true });
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Memory API running on port ${port}`));
