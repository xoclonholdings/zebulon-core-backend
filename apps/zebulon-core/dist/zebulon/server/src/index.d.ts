/**
 * ZED BACKEND ENTRYPOINT
 *
 * API BASE URL: /
 *
 * Guaranteed endpoints for frontend integration:
 *   - GET  /health   (returns 200 OK JSON or text)
 *   - POST /chat     (expects { message: string }, returns { reply: string })
 *
 * All environments (dev/prod) will always expose these endpoints at the root path.
 *
 * If you change the API base path, update this block and notify frontend developers.
 */
import "dotenv/config";
