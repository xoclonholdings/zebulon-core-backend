
import { Router } from "express";
import cors from "cors";
import { appendMessage, getHistory } from "./chatContext";
import { ollamaChat } from "./ollamaClient";
import { agentChat } from "./agentOpenAIClient";
import fs from "fs";
import path from "path";

const zedLiteRouter = Router();

// CORS for CodeSandbox only for this route
const codesandboxCors = cors({
  origin: [/\.codesandbox\.io$/, "https://codesandbox.io"],
  methods: ["GET", "POST", "OPTIONS"],
});

zedLiteRouter.options("/zed-lite", codesandboxCors);


// Lightweight interaction logging for /zed-lite
interface ZedLiteLogEntry {
  user_message: string;
  zed_response: string;
  mode?: string;
  feedback?: "upvote" | "downvote";
}
function logZedLiteInteraction({ user_message, zed_response, mode = "chat", feedback }: ZedLiteLogEntry) {
  const logDir = path.join(__dirname, "..", "logs");
  const logFile = path.join(logDir, "zed-lite-interactions.log");
  const entry = {
    user_message,
    zed_response,
    timestamp: new Date().toISOString(),
    mode,
    ...(feedback ? { feedback } : {})
  };
  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
  } catch (err) {
    // Fail silently for logging errors
  }
}

zedLiteRouter.post("/zed-lite", codesandboxCors, async (req, res) => {
  const { message, mode, feedback } = req.body || {};
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

  // Log interaction (self-contained, can be removed safely)
  logZedLiteInteraction({
    user_message: message,
    zed_response: text,
    mode: mode || "chat",
    feedback: ["upvote", "downvote"].includes(feedback) ? feedback : undefined
  });

  res.json({ text });
});

export default zedLiteRouter;
