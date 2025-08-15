import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.use(express.json());
app.use(cookieParser());

// Health + readiness
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));
app.get("/readyz", (_req, res) => res.status(200).json({ ready: true }));

// Version + echo for quick checks
app.get("/api/version", (_req, res) => {
  res.json({
    name: "zebulon-core-backend",
    version: process.env.APP_VERSION || "0.1.0",
    env: process.env.NODE_ENV || "production"
  });
});

app.post("/api/echo", (req, res) => {
  res.json({ received: req.body ?? null });
});

// Minimal stubbed “AI/memory” endpoints (no external deps)
type MemoryItem = { id: string; data: any; ts: number };
const memory: Record<string, MemoryItem> = {};

app.post("/api/memory", (req, res) => {
  const id = String(Date.now());
  memory[id] = { id, data: req.body ?? null, ts: Date.now() };
  res.status(201).json(memory[id]);
});

app.get("/api/memory/:id", (req, res) => {
  const item = memory[req.params.id];
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

// Root
app.get("/", (_req, res) => {
  res.status(200).send("Zebulon Core Backend is running.");
});

// Start
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on :${PORT}`);
});