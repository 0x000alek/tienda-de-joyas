import logger from '../src/helpers/logger.js';

/**
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('express').ErrorRequestHandler} ErrorRequestHandler
 */

/**
 * Middleware que registra información de cada solicitud HTTP al finalizar la respuesta.
 *
 * Registra:
 * - Método HTTP, URL original, código de estado y tiempo de respuesta en milisegundos.
 * - Usa `logger.info` para respuestas exitosas (códigos 2xx-3xx).
 * - Usa `logger.warn` para errores del cliente (códigos 4xx).
 * - Usa `logger.error` para errores del servidor (códigos 5xx).
 *
 * @returns {RequestHandler} Middleware de registro de solicitudes.
 */
const log = () => (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  logger.info(`${method} ${originalUrl} - request received`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const message = `${method} ${originalUrl} ${statusCode} - request completed in ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(message);
    } else if (statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};

/**
 * Express error-handling middleware.
 *
 * Logs the error message and stack trace, then sends a generic 500 response.
 *
 * @returns {ErrorRequestHandler} The error-handling middleware function.
 */
const errorHandler = () => (err, _req, res, _next) => {
  logger.error(`${err.message}\n${err.stack}`);

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong, please try again later.',
  });
};

export default { log, errorHandler };
