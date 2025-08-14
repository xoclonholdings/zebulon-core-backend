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

import { User as SelectUser } from "apps/zeta/server/social-auth.js";
import { Request } from "express";

declare global {
	namespace Express {
		interface User {
			id?: number;
			username?: string;
			email?: string;
			[key: string]: any;
		}
		interface Request {
			user?: User | SelectUser;
			login?: (user: User, done: (err?: any) => void) => void;
			logout?: (done: (err?: any) => void) => void;
			isAuthenticated?: () => boolean;
		}
	}
}

declare module "passport";
declare module "passport-local";
declare module "passport-twitter";
declare module "passport-instagram-graph";
declare module "passport-snapchat";
declare module "openid-client";
declare module "openid-client/passport";
declare module "connect-pg-simple";
declare module "memoizee";
declare module "nanoid";
