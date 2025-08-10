import { Router } from "express";
import cors from "cors";
import { appendMessage, getHistory } from "./chatContext";
import { ollamaChat } from "./ollamaClient";
import { agentChat } from "./agentOpenAIClient";

const zedLiteRouter = Router();

// CORS for CodeSandbox only for this route
const codesandboxCors = cors({
  origin: [/\.codesandbox\.io$/, "https://codesandbox.io"],
  methods: ["GET", "POST", "OPTIONS"],
});

zedLiteRouter.options("/zed-lite", codesandboxCors);

zedLiteRouter.post("/zed-lite", codesandboxCors, async (req, res) => {
  const { message, mode } = req.body || {};
  if (!message) return res.status(400).json({ error: "message required" });
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
  res.json({ text });
});

export default zedLiteRouter;
