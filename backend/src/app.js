/**
 * src/app.js
 *
 * Express application factory.
 *
 * This module exports the configured Express `app` instance WITHOUT
 * calling app.listen().  Keeping application configuration separate
 * from server startup allows test suites to import `app` directly
 * via Supertest without occupying a real network port.
 *
 * Middleware order matters in Express — do not rearrange:
 *  1. Security headers (Helmet)
 *  2. CORS preflight handling
 *  3. Body parsing
 *  4. Application routes
 *  5. 404 handler  ← catches unmatched routes
 *  6. Error handler ← catches errors forwarded via next(err)
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { NODE_ENV, FRONTEND_ORIGIN } from './config/env.js';
import healthRouter from './routes/health.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ─── 1. Security headers ────────────────────────────────────────────────────
// Helmet sets a sensible collection of HTTP security headers such as
// X-DNS-Prefetch-Control, X-Frame-Options, Strict-Transport-Security, etc.
app.use(helmet());

// ─── 2. CORS ────────────────────────────────────────────────────────────────
// In production only the declared FRONTEND_ORIGIN is allowed.
// In development, localhost origins commonly used by Vite / CRA are also
// permitted so the frontend team can work without touching .env.
const allowedOrigins =
  NODE_ENV === 'production'
    ? [FRONTEND_ORIGIN]
    : [FRONTEND_ORIGIN, 'http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// ─── 3. Body parsing ────────────────────────────────────────────────────────
app.use(express.json());

// ─── 4. Routes ──────────────────────────────────────────────────────────────
app.use('/api/v1/health', healthRouter);

// ─── 5. 404 handler ─────────────────────────────────────────────────────────
app.use(notFound);

// ─── 6. Central error handler ───────────────────────────────────────────────
app.use(errorHandler);

export default app;
