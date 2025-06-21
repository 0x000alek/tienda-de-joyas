export const HATEOAS = {
  /**
   * Construye una respuesta con formato HATEOAS.
   * @param {string} baseUrl - URL base para construir los enlaces.
   * @param {string} [entity=''] - (Opcional) Nombre del recurso para la ruta (ej: 'joya').
   * @param {Array<Object>} data - Array de objetos con datos principales (ej: joyas).
   * @returns {Promise<Object>} Objeto con total y resultados formateados con enlaces HATEOAS.
   */
  build: async (baseUrl, entity = '', data) => {
    const results = data.map((item) => ({
      name: item.nombre,
      href: entity
        ? `${baseUrl}/${entity}/${item.id}`
        : `${baseUrl}/${item.id}`,
    }));
    const totalJoyas = results.length;

    return {
      totalJoyas,
      results,
    };
  },
};
