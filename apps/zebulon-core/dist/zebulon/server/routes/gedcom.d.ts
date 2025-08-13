declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}
declare const router: import("express-serve-static-core").Router;
export default router;
