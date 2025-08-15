import { Express } from "express";
import { User as SelectUser } from "../shared/schema.js";
declare global {
    namespace Express {
        interface User extends SelectUser {
        }
    }
}
export declare function setupStandaloneAuth(app: Express): void;
