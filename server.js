import cors from 'cors';
import express from 'express';

import logger from './middlewares/logger.middlewares.js';
import joyasRoutes from './routes/joyas.routes.js';

import { config } from './config/joyas.config.js';

const { protocol, host, port } = config.server;
const serverUrl = `${protocol}://${host}:${port}`;

const app = express();

app.use(express.json());
app.use(cors());

app.use(joyasRoutes);

app.listen(port, () => {
  logger.info(`Server on fire 🔥 ${serverUrl}`);
});
