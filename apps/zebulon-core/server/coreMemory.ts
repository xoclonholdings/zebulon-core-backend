
// Persistent memory for logged-in users (in-memory for demo; use DB for production)
type MemoryEntry = { role: 'user' | 'assistant', message: string, tags?: string[], timestamp?: string };
const persistentMemory: Record<string, MemoryEntry[]> = {};

export function getUserMemory(userId: string, opts?: { tag?: string, limit?: number }) {
  let mem = persistentMemory[userId] || [];
  if (opts && typeof opts.tag === 'string') mem = mem.filter(e => e.tags && e.tags.includes(opts.tag!));
  if (opts?.limit) mem = mem.slice(-opts.limit);
  return mem;
}

export function appendUserMemory(userId: string, role: 'user' | 'assistant', message: string, tags?: string[]) {
  if (!persistentMemory[userId]) persistentMemory[userId] = [];
  persistentMemory[userId].push({ role, message, tags, timestamp: new Date().toISOString() });
  if (persistentMemory[userId].length > 100) persistentMemory[userId].shift();
}

export function clearUserMemory(userId: string) {
  delete persistentMemory[userId];
}

export function searchUserMemory(userId: string, query: string) {
  const mem = persistentMemory[userId] || [];
  return mem.filter(e => e.message.toLowerCase().includes(query.toLowerCase()));
}
