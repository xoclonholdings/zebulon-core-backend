// In-memory chat history per session
import { Request } from "express";

const chatHistory: Record<string, { role: 'user' | 'assistant', message: string }[]> = {};

export function getSessionId(req: Request): string {
  // Use session ID if available, else fallback to IP
  // @ts-ignore
  return req.sessionID || req.ip;
}

export function appendMessage(req: Request, role: 'user' | 'assistant', message: string) {
  const sessionId = getSessionId(req);
  if (!chatHistory[sessionId]) chatHistory[sessionId] = [];
  chatHistory[sessionId].push({ role, message });
  // Limit history to last 20 messages
  if (chatHistory[sessionId].length > 20) chatHistory[sessionId].shift();
}

export function getHistory(req: Request) {
  const sessionId = getSessionId(req);
  return chatHistory[sessionId] || [];
}

export function clearHistory(req: Request) {
  const sessionId = getSessionId(req);
  delete chatHistory[sessionId];
}
