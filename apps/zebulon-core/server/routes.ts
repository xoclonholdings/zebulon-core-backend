import zedLiteApi from "./zedLiteApi";
import { appendMessage, getHistory } from "./chatContext";
import { getUserMemory, appendUserMemory } from "./coreMemory";
import onboardingRouter from "./onboarding";
import apiAuthRouter from "./apiAuth";
import { getZedCoreData } from "./zedCoreData";


export function registerRoutes(app: any) {
	// Register onboarding route
	app.use(onboardingRouter);
	// Register authentication routes
	app.use(apiAuthRouter);
		// Register Zed Lite API route (isolated, CORS for CodeSandbox)
		app.use(zedLiteApi);

	return app;
}
export {}
