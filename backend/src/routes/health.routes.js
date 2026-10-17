/**
 * src/routes/health.routes.js
 *
 * Health check route — GET /api/v1/health
 *
 * Purpose: Allows load balancers, monitoring tools, and CI pipelines to
 * verify that the API server process is running and accepting requests.
 *
 * Intentionally lightweight:
 *  - Does NOT perform a database connection check (database is not yet
 *    integrated in Phase 1).
 *  - Does NOT claim the service is fully production-ready.
 */

import { Router } from 'express';

const router = Router();

/**
 * GET /api/v1/health
 *
 * @returns {200} JSON health status
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'upi-shield-backend',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
