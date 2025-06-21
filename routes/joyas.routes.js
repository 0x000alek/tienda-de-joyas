import { Router } from 'express';

import {
  getAllJoyasController,
  getJoyaByIdController,
} from '../src/controllers/joyas.controller.js';

const router = Router();

router.get('/joyas', getAllJoyasController);
router.get('/joyas/joya/:id', getJoyaByIdController);

export default router;
