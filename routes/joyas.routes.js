import { Router } from 'express';

import { getAllJoyasController } from '../src/controllers/joyas.controller.js';

const router = Router();

router.get('/joyas', getAllJoyasController);

export default router;
