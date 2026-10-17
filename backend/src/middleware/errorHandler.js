/**
 * src/middleware/errorHandler.js
 *
 * Central Express error-handling middleware.
 * Must be registered LAST, after all routes and other middleware.
 *
 * Behaviour:
 *  - Uses err.statusCode if set, otherwise defaults to 500.
 *  - Returns a consistent JSON error envelope.
 *  - Hides internal stack traces in production to prevent information leakage.
 */

/**
 * @param {Error & { statusCode?: number }} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next   // required for Express to treat this as error middleware
 */
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      // Stack traces are only included during local development to aid debugging.
      // They are NEVER sent to clients in production.
      ...(!isProduction && { stack: err.stack }),
    },
  });
};
