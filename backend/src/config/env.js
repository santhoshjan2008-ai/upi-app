/**
 * src/config/env.js
 *
 * Reads environment variables and exposes them as named exports
 * with safe defaults for local development.
 *
 * Usage:
 *   import { PORT, NODE_ENV, FRONTEND_ORIGIN } from './config/env.js';
 *
 * For local development, copy .env.example to .env and start the server
 * with:
 *   node --watch --env-file=.env src/server.js
 *   (requires Node.js >= 20.6.0)
 *
 * In production, set environment variables through your hosting platform.
 * Never hard-code secrets here.
 */

export const PORT = Number(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
