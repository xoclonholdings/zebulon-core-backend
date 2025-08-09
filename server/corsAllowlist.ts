import { Request, Response, NextFunction } from "express";

const allowedOrigins = [
  "https://zed-ai.online",
  "http://localhost:5173"
];
const netlifyPreviewRegex = /^https:\/\/[a-z0-9-]+(-[a-z0-9]+)*\.netlify\.app$/;

export function corsAllowlist(req: Request, res: Response, next: NextFunction) {
  // Set strict CSP header (allow Vite HMR websocket in dev)
  const isDev = process.env.NODE_ENV !== 'production';
  let csp = "default-src 'self'; script-src 'self' 'strict-dynamic' https: 'unsafe-inline'; object-src 'none'; connect-src 'self' https://zed-ai.online https://*.netlify.app http://localhost:5173";
  if (isDev) csp += " ws://localhost:5173";
  csp += "; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';";
  res.setHeader("Content-Security-Policy", csp);

  const origin = req.headers.origin;
  const isAllowed =
    !!origin &&
    (allowedOrigins.includes(origin) || netlifyPreviewRegex.test(origin));

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Authorization, Content-Type"
    );
  }

  if (req.method === "OPTIONS") {
    if (isAllowed) {
      res.status(204).end();
    } else {
      res.status(403).json({ error: "CORS origin denied" });
    }
    return;
  }

  if (!isAllowed && origin) {
    res.status(403).json({ error: "CORS origin denied" });
    return;
  }

  return next();
}
