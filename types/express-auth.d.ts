import "express";

declare global {
  namespace Express {
    interface User {
      id?: number;
      username?: string | null;
      email?: string | null;
      [key: string]: any;
    }
    interface Request {
      user?: User;
      login?: (user: User, done: (err?: any) => void) => void;
      logout?: (done: (err?: any) => void) => void;
      isAuthenticated?: () => boolean;
    }
  }
}
