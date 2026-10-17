/**
 * src/middleware/notFound.js
 *
 * Catches any request that did not match a defined route and returns
 * a consistent 404 JSON response.
 *
 * Must be registered AFTER all route definitions.
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};
