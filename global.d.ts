// Global type stubs for Drizzle ORM and other problematic modules
declare module 'drizzle-orm/*';
declare module 'mysql2';
declare module 'mysql2/promise';
declare module '@playwright/test';
import 'express-session';

declare module 'express-session' {
	interface SessionData {
		user?: {
			username: string;
			[key: string]: any;
		};
	}
}
