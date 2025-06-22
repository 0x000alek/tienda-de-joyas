import format from 'pg-format';

import { config } from '../../config/joyas.config.js';

import pool from '../../db/config.js';

import logger from '../helpers/logger.js';
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

  const queryCountAllJoyas = format('SELECT COUNT(*) FROM inventario');
  const querySelectAllJoyasWithParams = format(
    'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
    orderByColumn,
    orderByDirection,
    limit,
    offset
  );
  logger.info(`Executed query: ${querySelectAllJoyasWithParams}`);

  const { rows: countAllResult } = await pool.query(queryCountAllJoyas);
  const { rows: joyas } = await pool.query(querySelectAllJoyasWithParams);
  const stockTotal = parseInt(countAllResult[0].count);

  return { stockTotal, joyas };
};

/**
 * Recupera una joya específica de la base de datos por su ID.
 *
 * Esta función ejecuta una consulta SQL para seleccionar todas las columnas de la tabla `inventario`
 * donde el campo `id` coincida con el valor proporcionado.
 * Además, registra en el logger la consulta ejecutada para facilitar el seguimiento.
 *
 * @param {number|string} id - Identificador único de la joya.
 * @returns {Promise<Array>} Array con la(s) fila(s) de la joya encontrada.
 */
export const getJoyaByIdModel = async (id) => {
  const query = format('SELECT * FROM inventario WHERE id = %s', id);
  logger.info(`Executed query: ${query}`);

  const { rows: results } = await pool.query(query);

  return results;
};
