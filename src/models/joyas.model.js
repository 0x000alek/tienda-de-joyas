import pool from '../../db/config.js';
import logger from '../../middlewares/logger.middlewares.js';

import { config } from '../../config/joyas.config.js';
import { parseOrderBy } from '../helpers/parseOrderBy.js';

/**
 * Recupera un listado paginado de joyas desde la base de datos, con soporte para ordenamiento.
 *
 * Esta función realiza dos consultas:
 * 1. Cuenta el total de registros en la tabla `inventario`.
 * 2. Obtiene un subconjunto de registros según los parámetros de paginación y ordenamiento.
 *
 * @param {Object} params - Parámetros opcionales para la consulta.
 * @param {number} [params.limits] - Cantidad de registros por página. Si no se especifica, se usa el valor por defecto desde config.
 * @param {number} [params.page] - Página actual. Si no se especifica, se usa la primera página.
 * @param {string} [params.orderBy] - Criterio de ordenamiento en formato "columna_DIRECCION" (ej: "precio_DESC").
 *
 * @returns {Promise<Object>} Objeto con:
 *   - stockTotal: total de registros en la tabla (sin paginar).
 *   - joyas: array de joyas obtenidas según los parámetros aplicados.
 */
export const getAllJoyasModel = async ({ limits, page, orderBy } = {}) => {
  const { allowedOrderBy, defaultLimits, defaultPage, defaultOrderBy } =
    config.db.queries.inventario;
  const limit = limits || defaultLimits;
  const currentPage = page || defaultPage;
  const offset = (currentPage - 1) * limit;
  const { column: orderByColumn, direction: orderByDirection } = parseOrderBy(
    orderBy,
    allowedOrderBy,
    defaultOrderBy
  );

  const queryCountAllJoyas = {
    text: 'SELECT COUNT(*) FROM inventario',
  };
  const querySelectAllJoyasWithParams = {
    text: `SELECT * FROM inventario ORDER BY ${orderByColumn} ${orderByDirection} LIMIT $1 OFFSET $2`,
    values: [limit, offset],
  };
  logger.info(
    `Executed query: SELECT * FROM inventario ORDER BY ${orderByColumn} ${orderByDirection} LIMIT ${limit} OFFSET ${offset}`
  );

  const { rows: countAllResult } = await pool.query(queryCountAllJoyas);
  const { rows: joyas } = await pool.query(querySelectAllJoyasWithParams);
  const stockTotal = parseInt(countAllResult[0].count);

  return { stockTotal, joyas };
};
