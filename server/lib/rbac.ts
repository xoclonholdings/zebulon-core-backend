import { Request, Response, NextFunction } from 'express';

export function rbacGuard(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: check user role from session or token
    // For now, allow all for scaffold
    next();
  };
}
