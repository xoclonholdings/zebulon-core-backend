import zedLiteApi from "./zedLiteApi";
import { appendMessage, getHistory } from "./chatContext";
import { getUserMemory, appendUserMemory, searchUserMemory, clearUserMemory } from "./coreMemory";
import onboardingRouter from "./onboarding";
import apiAuthRouter from "./apiAuth";
import { getZedCoreData } from "./zedCoreData";
import { ollamaChat, listOllamaModels, ollamaHealthCheck, switchOllamaModel } from "./ollamaClient";
import { agentChat } from "./agentOpenAIClient";

export function registerRoutes(app: any) {
			// Advanced memory management endpoints
			app.get('/memory', (req: any, res: any) => {
				const userId = req.session?.user?.username;
				if (!userId) return res.status(401).json({ error: 'Not authenticated' });
				const { tag, limit } = req.query;
				const mem = getUserMemory(userId, { tag: tag as string | undefined, limit: limit ? Number(limit) : undefined });
				res.json({ memory: mem });
			});

			app.get('/memory/search', (req: any, res: any) => {
				const userId = req.session?.user?.username;
				if (!userId) return res.status(401).json({ error: 'Not authenticated' });
				const { q } = req.query;
				if (!q) return res.status(400).json({ error: 'query required' });
				const results = searchUserMemory(userId, q as string);
				res.json({ results });
			});

			app.post('/memory/clear', (req: any, res: any) => {
				const userId = req.session?.user?.username;
				if (!userId) return res.status(401).json({ error: 'Not authenticated' });
				clearUserMemory(userId);
				res.json({ ok: true });
			});
	// Register onboarding route
	app.use(onboardingRouter);
	// Register authentication routes
	app.use(apiAuthRouter);
		// Register Zed Lite API route (isolated, CORS for CodeSandbox)
		app.use(zedLiteApi);
			// Register the /chat endpoint
			// Enhanced /chat endpoint: supports streaming, model selection, and advanced error handling
			app.post("/chat", async (req: any, res: any) => {
				const { message, mode, model, stream } = req.body;
				if (!message) {
					return res.status(400).json({ error: "message required" });
				}
				const userId = req.session?.user?.username;
				let history;
				if (userId) {
					appendUserMemory(userId, "user", message);
					history = getUserMemory(userId);
				} else {
					appendMessage(req, "user", message);
					history = getHistory(req);
				}
				try {
					if (stream) {
						res.setHeader('Content-Type', 'text/event-stream');
						res.setHeader('Cache-Control', 'no-cache');
						res.setHeader('Connection', 'keep-alive');
						let full = '';
						await ollamaChat(
							message,
							history,
							model,
							{
								stream: true,
								onToken: (token: string) => {
									full += token;
									res.write(`data: ${JSON.stringify({ token })}\n\n`);
								}
							}
						);
						if (userId) appendUserMemory(userId, "assistant", full);
						else appendMessage(req, "assistant", full);
						res.write(`data: ${JSON.stringify({ done: true, reply: full })}\n\n`);
						res.end();
					} else {
						let reply = "";
						if (mode === "agent") {
							reply = await agentChat(message, history, model);
						} else {
							reply = await ollamaChat(message, history, model);
						}
						if (userId) appendUserMemory(userId, "assistant", reply);
						else appendMessage(req, "assistant", reply);
						return res.status(200).json({ reply, history });
					}
				} catch (err: any) {
					const errorMsg = err?.message || '[ZED AI Error] Sorry, I couldn\'t process your request right now.';
					if (stream) {
						res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
						res.end();
					} else {
						return res.status(500).json({ error: errorMsg });
					}
				}
			});

			// List Ollama models
			app.get('/ollama/models', async (_req: any, res: any) => {
				try {
					const models = await listOllamaModels();
					res.json({ models });
				} catch (e: any) {
					res.status(500).json({ error: e.message });
				}
			});

			// Ollama health check
			app.get('/ollama/health', async (_req: any, res: any) => {
				const health = await ollamaHealthCheck();
				res.json(health);
			});

			// Switch Ollama model (no-op, placeholder)
			app.post('/ollama/switch-model', async (req: any, res: any) => {
				const { model } = req.body;
				if (!model) return res.status(400).json({ error: 'model required' });
				const result = await switchOllamaModel(model);
				res.json(result);
			});
	return app;
}
export {}
