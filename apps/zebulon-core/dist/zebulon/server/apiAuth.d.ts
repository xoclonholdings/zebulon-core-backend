declare module 'express-session' {
    interface SessionData {
        user?: {
            username: string;
        };
    }
}
declare const router: import("express-serve-static-core").Router;
export default router;
