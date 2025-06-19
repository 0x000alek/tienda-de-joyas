import pool from '../../db/config.js';
import logger from '../../middlewares/logger.middlewares.js';

export const getAllJoyasModel = async () => {
  const query = { text: 'SELECT * FROM inventario' };
  const { rows, rowCount } = await pool.query(query);
  logger.info(`${rowCount} rows fetched from database`);

  return rows;
};
