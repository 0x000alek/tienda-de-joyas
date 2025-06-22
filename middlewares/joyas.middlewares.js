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
 * Middleware para rutas no encontradas (404).
 *
 * Registra una advertencia y responde con JSON indicando ruta no encontrada.
 *
 * @returns {RequestHandler}
 */
const notFound = () => (req, res) => {
  logger.warn(`404 - Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
};

/**
 * Middleware de manejo de errores para Express.
 *
 * Registra en el logger el mensaje y el stack trace del error recibido,
 * y responde al cliente con un estado HTTP 500 y un mensaje genérico.
 *
 * Este middleware debe ubicarse después de todas las rutas y middlewares
 * para capturar errores no controlados durante el procesamiento de solicitudes.
 *
 * @returns {ErrorRequestHandler} Middleware para manejo de errores.
 */
const errorHandler = () => (err, _req, res, _next) => {
  logger.error(`${err.message}\n${err.stack}`);

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong, please try again later.',
  });
};

export default { log, notFound, errorHandler };
