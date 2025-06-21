import logger from '../../middlewares/logger.middlewares.js';

import { HATEOAS } from '../helpers/hateoas.js';
import { getAllJoyasModel } from '../models/joyas.model.js';

/**
 * Controlador para obtener un listado de joyas con soporte de paginación, ordenamiento y respuesta en formato HATEOAS.
 *
 * Este controlador extrae los parámetros opcionales desde la query string:
 * - `limits`: cantidad máxima de resultados por página (opcional).
 * - `page`: número de página solicitada para la paginación (opcional).
 * - `order_by`: criterio de ordenamiento en formato 'columna_DIRECCION' (ej: 'precio_DESC') (opcional).
 *
 * Se genera dinámicamente la URL base (`baseUrl`) para construir enlaces HATEOAS,
 * y se utiliza el helper `HATEOAS.build()` para estructurar la respuesta.
 *
 * La respuesta incluye:
 * - `totalJoyas`: número de joyas devueltas en la página actual.
 * - `stockTotal`: total de joyas en el inventario (sin paginación).
 * - `results`: array con objetos que contienen nombre y enlace de cada joya.
 *
 * En caso de error, se registra el error y se responde con estado HTTP 500.
 *
 * @param {Request} req - Objeto de solicitud HTTP de Express.
 * @param {Response} res - Objeto de respuesta HTTP de Express.
 */
export const getAllJoyasController = async (req, res) => {
  try {
    const { limits, page, order_by: orderBy } = req.query;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    const { stockTotal, joyas } = await getAllJoyasModel({
      limits,
      page,
      orderBy,
    });
    const { totalJoyas, results } = await HATEOAS.build(baseUrl, 'joya', joyas);
    logger.info(`Joyas fetched successfully: ${JSON.stringify(joyas)}`);

    res.status(200).json({ totalJoyas, stockTotal, results });
  } catch (error) {
    logger.error(`Error in getAllJoyasController: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
