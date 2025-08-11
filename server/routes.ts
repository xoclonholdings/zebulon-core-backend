import zedLiteApi from "./zedLiteApi";
import { appendMessage, getHistory } from "./chatContext";
import { getUserMemory, appendUserMemory } from "./coreMemory";
import onboardingRouter from "./onboarding";
import apiAuthRouter from "./apiAuth";

import zuluRouter from './routes/zulu';
import { getZedCoreData } from "./zedCoreData";
import { ollamaChat } from "./ollamaClient";
import { agentChat } from "./agentOpenAIClient";

export function registerRoutes(app: any) {
	// Register onboarding route
	app.use(onboardingRouter);
	// Register authentication routes
	app.use(apiAuthRouter);
	// Register Zulu system/diagnostics API
	app.use('/api/zulu', zuluRouter);
	// Register Zed Lite API route (isolated, CORS for CodeSandbox)
	app.use(zedLiteApi);
			// Register the /chat endpoint
			app.post("/chat", async (req: any, res: any) => {
				const { message, mode } = req.body;
				if (!message) {
					return res.status(400).json({ error: "message required" });
				}
				// Determine if user is logged in
				const userId = req.session?.user?.username;
				let history;
				if (userId) {
					appendUserMemory(userId, "user", message);
					history = getUserMemory(userId);
				} else {
					appendMessage(req, "user", message);
					history = getHistory(req);
				}
				let reply = "";
				try {
					if (mode === "agent") {
						// Agent Mode: Try OpenAI, fallback to Ollama agent model
						reply = await agentChat(message, history);
					} else {
						// Default: Use Ollama for chat
						reply = await ollamaChat(message, history);
					}
				} catch (err) {
					reply = "[ZED AI Error] Sorry, I couldn't process your request right now.";
				}
				if (userId) {
					appendUserMemory(userId, "assistant", reply);
				} else {
					appendMessage(req, "assistant", reply);
				}
				return res.status(200).json({ reply, history });
			});
	return app;
}
export {}
