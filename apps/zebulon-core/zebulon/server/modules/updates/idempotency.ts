import { sha256 } from "./crypto";

const TTL = Number(process.env.UPDATE_IDEMPOTENCY_TTL_MS ?? 600_000);

type Entry = { ts: number };

const store = new Map<string, Entry>();

export function checkAndSet(key: string): boolean {
  const now = Date.now();
  // cleanup expired
  for (const [k, v] of store) {
    if (now - v.ts > TTL) store.delete(k);
  }
  const hashed = sha256(key);
  if (store.has(hashed)) return false;
  store.set(hashed, { ts: now });
  return true;
}
