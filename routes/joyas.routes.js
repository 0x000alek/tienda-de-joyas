import { Router } from 'express';

import {
  getAllJoyasController,
  getJoyaByIdController,
  getJoyasFilterModel,
} from '../src/controllers/joyas.controller.js';

const router = Router();

router.get('/joyas', getAllJoyasController);
router.get('/joyas/joya/:id', getJoyaByIdController);
router.get('/joyas/filter', getJoyasFilterModel);

export default router;
