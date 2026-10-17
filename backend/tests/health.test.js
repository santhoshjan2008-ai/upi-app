/**
 * tests/health.test.js
 *
 * Integration tests for the UPI Shield backend — Phase 1.
 *
 * Uses Vitest as the test runner and Supertest to fire real HTTP requests
 * against the Express app WITHOUT starting a network server (Supertest
 * handles binding internally).
 *
 * Tests run without a PostgreSQL connection because the database is not
 * integrated yet (Phase 1 scope).
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// ─── Health endpoint ─────────────────────────────────────────────────────────
describe('GET /api/v1/health', () => {
  it('returns HTTP 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
  });

  it('has success: true at the top level', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.body.success).toBe(true);
  });

  it('contains a data object with status "ok"', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.status).toBe('ok');
  });

  it('identifies the service as "upi-shield-backend"', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.body.data.service).toBe('upi-shield-backend');
  });

  it('includes an ISO 8601 timestamp', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.body.data.timestamp).toBeDefined();
    expect(new Date(res.body.data.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('returns Content-Type: application/json', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

// ─── Security headers (Helmet) ───────────────────────────────────────────────
describe('Security headers', () => {
  it('sets X-DNS-Prefetch-Control header', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
  });

  it('sets X-Frame-Options header', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('sets X-Content-Type-Options header', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});

// ─── 404 — unknown routes ────────────────────────────────────────────────────
describe('Unknown routes', () => {
  it('returns HTTP 404 for an undefined GET route', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns HTTP 404 for an undefined POST route', async () => {
    const res = await request(app).post('/api/v1/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns success: false in the 404 body', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    expect(res.body.success).toBe(false);
  });

  it('returns an error.message mentioning "Route not found"', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    expect(res.body.error).toBeDefined();
    expect(res.body.error.message).toMatch(/Route not found/i);
  });

  it('returns Content-Type: application/json on 404', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

// ─── Central error handler ───────────────────────────────────────────────────
describe('Central error handler', () => {
  it('does not expose a stack trace when NODE_ENV is production', async () => {
    // Temporarily simulate production mode for this assertion.
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // A 404 still goes through notFound which returns success: false — the
    // central handler is also exercised for any thrown errors.
    const res = await request(app).get('/api/v1/no-route-here');
    expect(res.body.error?.stack).toBeUndefined();

    process.env.NODE_ENV = original;
  });
});
