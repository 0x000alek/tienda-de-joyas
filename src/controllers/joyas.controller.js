import logger from '../../middlewares/logger.middlewares.js';
import { getAllJoyasModel } from '../models/joyas.model.js';

export const getAllJoyasController = async (req, res) => {
  try {
    const joyas = await getAllJoyasModel();
    logger.info(`Joyas fetched successfully: ${JSON.stringify(joyas)}`);

    res.status(200).json(joyas);
  } catch (error) {
    logger.error(`Error in getAllJoyasController: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
