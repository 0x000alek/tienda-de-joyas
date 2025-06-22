import logger from '../../middlewares/logger.middlewares.js';

import { HATEOAS } from '../helpers/hateoas.js';
import { getAllJoyasModel, getJoyaByIdModel, getJoyasFilterModel } from '../models/joyas.model.js';

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

/**
 * Controlador para obtener una joya específica por su ID.
 *
 * Extrae el parámetro `id` de la URL, llama al modelo para obtener la joya
 * correspondiente, y responde con los datos en formato JSON.
 * En caso de error, registra el problema y devuelve un error 500.
 *
 * @param {Request} req - Objeto de solicitud Express, se espera `req.params.id`.
 * @param {Response} res - Objeto de respuesta Express para enviar resultados al cliente.
 */
export const getJoyaByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid or missing id parameter' });
    }

    const joya = await getJoyaByIdModel(id);
    if (!joya) {
      return res.status(404).json({ error: 'Joya not found' });
    }
    logger.info(`Joya fetched successfully: ${JSON.stringify(joya)}`);

    res.status(200).json(joya);
  } catch (error) {
    logger.error(`Error in getJoyaByIdController: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Controlador para obtener la información de manera parametrizada con filtros
 *
 * Este controlador extrae los parámetros opcionales desde la query string:
 * - `precio_min`: filtra por cantidad mínima de dinero
 * - `precio_max` : filtra por cantidad máxima de dinero
 * - `categoría` : filtra por tipo de joya
 * - `metal` : filtra por tipo de metal
 */
export const getJoyasFilterController = async (req, res) => {
  try {
    const joyas = await getJoyasFilterModel(req.query);
    res.status(200).json(joyas);
  } catch (error) {
    logger.error(`Error in getJoyasFilterController: `, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
