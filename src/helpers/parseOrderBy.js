/**
 * Valida y parsea el parámetro order_by para consultas SQL seguras.
 * @param {string} input - String con formato 'columna_DIRECCION' (ejemplo: 'precio_DESC')
 * @param {string[]} allowedColumns - Array con nombres de columnas permitidas.
 * @param {string} defaultColumn - Columna por defecto si input es inválido.
 * @returns {{ column: string, direction: string }} Objeto con columna y dirección válidas.
 */
export const parseOrderBy = (input, allowedColumns, defaultColumn) => {
  if (!input || typeof input !== 'string')
    return { column: defaultColumn, direction: 'ASC' };

  const [rawColumn, rawDirection] = input.split('_');
  const column = allowedColumns.includes(rawColumn) ? rawColumn : defaultColumn;

  let direction = 'ASC';
  if (rawDirection?.toUpperCase() === 'DESC') {
    direction = 'DESC';
  } else if (rawDirection && rawDirection.toUpperCase() !== 'ASC') {
    direction = 'ASC';
  }

  return { column, direction };
};
