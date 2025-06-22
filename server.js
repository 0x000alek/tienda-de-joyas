import cors from 'cors';
import express from 'express';

import { config } from './config/joyas.config.js';

import logger from './src/helpers/logger.js';
import joyasMiddlewares from './middlewares/joyas.middlewares.js';

import joyasRoutes from './routes/joyas.routes.js';

const { protocol, host, port } = config.server;
const serverUrl = `${protocol}://${host}:${port}`;

const app = express();

app.use(express.json());
app.use(cors());

app.use(joyasMiddlewares.log());

app.use(joyasRoutes);

app.use(joyasMiddlewares.errorHandler());

app.listen(port, () => {
  logger.info(`Server on fire 🔥 ${serverUrl}`);
});
