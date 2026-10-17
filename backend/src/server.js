/**
 * src/server.js
 *
 * Entry point — binds the Express application to a network port.
 *
 * This file is intentionally kept minimal: it imports the pre-configured
 * `app` and calls listen().  All application logic lives in app.js.
 *
 * To run locally:
 *   1. cp .env.example .env
 *   2. Fill in values in .env
 *   3. node --watch --env-file=.env src/server.js    (development)
 *      node src/server.js                             (production, env already set)
 *
 * Requires Node.js >= 20.6.0 for the --env-file flag.
 */

import app from './app.js';
import { PORT, NODE_ENV } from './config/env.js';

const server = app.listen(PORT, () => {
  console.log(`[upi-shield] server running on port ${PORT} (${NODE_ENV})`);
  console.log(`[upi-shield] health → http://localhost:${PORT}/api/v1/health`);
});

// Graceful shutdown — ensures in-flight requests finish before the process exits.
const shutdown = (signal) => {
  console.log(`\n[upi-shield] received ${signal}, shutting down gracefully…`);
  server.close(() => {
    console.log('[upi-shield] HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
