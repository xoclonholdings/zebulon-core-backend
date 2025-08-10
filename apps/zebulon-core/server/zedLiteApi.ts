import { Router } from "express";
import cors from "cors";
import { appendMessage, getHistory } from "./chatContext";
import { ollamaChat } from "./ollamaClient";
import { agentChat } from "./agentOpenAIClient";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const zedLiteRouter = Router();

// CORS for CodeSandbox and zed-ai.online only for this route
const codesandboxCors = cors({
  origin: [/\.codesandbox\.io$/, "https://codesandbox.io", "https://zed-ai.online"],
  methods: ["GET", "POST", "OPTIONS"],
});

zedLiteRouter.options("/zed-lite", codesandboxCors);

// Persistent log file path
const logDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logDir, "zed-lite-interactions.json");

function ensureLogDir() {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
}

function appendLogEntry(entry: any) {
  ensureLogDir();
  let logs: any[] = [];
  if (fs.existsSync(logFile)) {
    try {
      logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
      if (!Array.isArray(logs)) logs = [];
    } catch {
      logs = [];
    }
  }
  logs.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

function updateLogFeedback(logId: string, feedback: string) {
  ensureLogDir();
  if (!fs.existsSync(logFile)) return false;
  let logs: any[] = [];
  try {
    logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
    if (!Array.isArray(logs)) return false;
  } catch {
    return false;
  }
  let updated = false;
  logs = logs.map((entry) => {
    if (entry.logId === logId) {
      updated = true;
      return { ...entry, feedback };
    }
    return entry;
  });
  if (updated) fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  return updated;
}

zedLiteRouter.post("/zed-lite", codesandboxCors, async (req, res) => {
  const { message, mode, logId, feedback } = req.body || {};

  // Feedback update only
  if (!message && logId && feedback) {
    const ok = updateLogFeedback(logId, feedback);
    if (ok) {
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: "logId not found" });
    }
    return;
  }

  // Message-based reply
  if (!message) {
    res.status(400).json({ error: "message required" });
    return;
  }
  let history = getHistory(req);
  let text = "";
  try {
    if (mode === "agent") {
      text = await agentChat(message, history);
    } else {
      text = await ollamaChat(message, history);
    }
  } catch (err) {
    text = "[ZED LITE Error] Sorry, I couldn't process your request right now.";
  }
  appendMessage(req, "user", message);
  appendMessage(req, "assistant", text);

  // Log interaction
  const entry = {
    logId: logId || uuidv4(),
    user_message: message,
    zed_response: text,
    timestamp: new Date().toISOString(),
    mode: mode || "chat"
  };
  appendLogEntry(entry);

  res.json({ text, logId: entry.logId });
});

export default zedLiteRouter;
