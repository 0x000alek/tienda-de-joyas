import fs from 'fs';
import path from 'path';
import winston from 'winston';

import { config } from '../../config/joyas.config.js';

const { env } = config.server;

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  verbose: 'blue',
  debug: 'green',
  silly: 'grey',
});

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const timestampFormat = winston.format.timestamp({
  format: () => {
    const now = new Date();
    const date = now.toLocaleDateString('es-CL', {
      timeZone: 'America/Santiago',
    });
    const time = now.toLocaleTimeString('es-CL', {
      timeZone: 'America/Santiago',
      hour12: false,
    });
    const ms = now.getMilliseconds().toString().padStart(3, '0');

    return `${date} ${time}.${ms}`;
  },
});

const fileFormat = winston.format.combine(
  winston.format.uncolorize(),
  timestampFormat,
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);
const consoleFormat = winston.format.combine(
  winston.format.colorize({ level: true }),
  timestampFormat,
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    // - Escribe todos los registros con nivel de importancia `error` o superior en `error.log`
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // - Escribe todos los registros con nivel de importancia `info` o superior en `combined.log`
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// Si no estamos en ambiente de producción, entonces se registra en la consola con el siguiente formato:
// `[${timestamp}] ${level}: ${message}`
if (env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;
