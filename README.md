# Backend con Node y Express (G86) - Desafio: Tienda de Joyas

_A collaboration between [Melany Menares](https://github.com/milimenares) and [Alexis Olguín](https://github.com/0x000alek)_

Este repositorio continene el dessarrollo de la solución propuesta para el _Desafío Tienda de Joyas_, del curso **Backend con Node y Express (G86)**.

## 🚀 Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

### 1. Clona el repositorio

Para obtener una copia local del proyecto, ejecuta el siguiente comando:

```bash
git clone https://github.com/usuario/tienda-de-joyas.git
cd tienda-de-joyas
```

Esto descargará todo el código fuente y te posicionará dentro de la carpeta raíz del proyecto, lista para comenzar a trabajar.

### 2. Instala las dependencias

Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```bash
npm install
```

Durante esta instalación, se ejecutará automáticamente el script `prepare` definido en el `package.json`. Este script:

- Inicializa Husky localmente para habilitar los hooks de Git.

- Otorga los permisos de ejecución necesarios a los hooks que se encuentran en la carpeta .husky/.

Esto asegura que los hooks como `commit-msg` funcionen correctamente desde el inicio.

Una vez finalizada la instalación, deberías ver en la terminal una salida similar a siguiente:

```plaintext
> tienda-de-joyas@1.0.0 prepare
> husky install && chmod +x .husky/\*

husky - Git hooks installed

added 366 packages, and audited 367 packages in 23s

118 packages are looking for funding
run `npm fund` for details

found 0 vulnerabilities
```

📌 La cantidad de paquetes puede variar según la versión de las dependencias y tu entorno. ✅ Lo importante es que veas el mensaje `husky - Git hooks installed`, que confirma que los hooks fueron configurados correctamente.

### 3. Copia y configura las variables de entorno

Copia el archivo de ejemplo de variables de entorno para crear tu propia configuración local:

```bash
cp .env.example .env
```

Luego, abre el archivo `.env` y edita las variables según tu entorno de desarrollo. Aquí deberás especificar detalles como la conexión a la base de datos, el puerto del servidor y otras configuraciones sensibles que no se almacenan en el repositorio.

### 4. Inicia el servidor

Una vez configuradas las dependencias y variables de entorno, puedes iniciar el servidor ejecutando:

```bash
npm run dev
```

Este comando utiliza la opción `--watch` de Node.js (requiere versión 18 o superior) para ejecutar server.js y reiniciar automáticamente el servidor cada vez que se detecten cambios en el código fuente. Esto facilita un flujo de desarrollo más ágil y eficiente.

Si todo está correctamente configurado, deberías ver en la terminal una salida similar a la siguiente:

```plaintext
> tienda-de-joyas@1.0.0 dev
> node --watch server.js

[DD-MM-AAAA HH:mm:ss.SSS] info: Server on fire 🔥 http://localhost:5000
[DD-MM-AAAA HH:mm:ss.SSS] info: Database connected successfully: current_database at current_timestamp
```

📌 El formato de fecha y hora (`DD-MM-AAAA HH:mm:ss.SSS`) corresponde al timestamp generado por el logger (`winston`) y puede variar según tu zona horaria y configuración local.

El valor `current_timestamp` representa la fecha y hora actual devuelta por la base de datos al momento de establecer la conexión. Es útil para confirmar que la base de datos respondió correctamente y que está sincronizada con el servidor en cuanto a tiempo. Normalmente corresponde al resultado del comando SQL _SELECT NOW()_.

Por otro lado, el valor `current_database` indica el nombre de la base de datos a la que se ha establecido la conexión. Este valor se obtiene mediante el comando SQL _SELECT current_database()_ y permite verificar que la aplicación está conectada al entorno correcto (por ejemplo, desarrollo, pruebas o producción).

Por último, asegúrate de que los valores de la URL, el puerto y la base de datos coincidan con los definidos en tu archivo `.env`.

## 📁 Estructura de carpetas

```plaintext
tienda-de-joyas             # Carpeta raíz del proyecto
├── .husky                  # Hooks de Git configurados con Husky para validar commits, ejecutar linters, etc.
├── config                  # Archivos de configuración del servidor. Carga y validación de variables desde `.env`
├── db                      # Archivos relacionados con la base de datos (conexión, configuración, esquemas)
│   └── schema              # Scripts SQL para definir estructura y tablas de la base de datos
├── docs                    # Documentación del proyecto (manuales, diagramas, especificaciones)
├── middlewares             # Middlewares personalizados de Express para manejo de errores, autenticación, CORS, etc.
├── routes                  # Definición de rutas o endpoints de la API (configuración de Express)
└── src
    ├── controllers         # Lógica que procesa peticiones y respuestas (controladores)
    ├── helpers             # Funciones auxiliares reutilizables (helpers) para validaciones, formateo, parsers, etc.
    └── models              # Ejecución de consultas SQL y gestión de acceso a datos
```

## 📡 Endpoints disponibles

### `GET /joyas`

Devuelve una lista paginada de joyas desde la base de datos.

#### 🔸 Parámetros de consulta (query string)

| Parámetro  | Tipo   | Descripción                                                                                       |
| ---------- | ------ | ------------------------------------------------------------------------------------------------- |
| `limits`   | number | (Opcional) Cantidad de resultados por página. Por defecto se usa `.env`                           |
| `page`     | number | (Opcional) Número de página. Por defecto es 1                                                     |
| `order_by` | string | (Opcional) Criterio de ordenamiento. Formato: `columna_ASC` o `columna_DESC`<br>Ej: `precio_DESC` |

✅ Las columnas permitidas para `order_by` son: `id`, `nombre`, `categoria`, `metal`, `precio`, `stock`.

#### 🛸 Ejemplo de solicitud

```bash
GET http://localhost:5000/joyas?limits=3&page=1&order_by=stock_ASC
```

#### 🆗 Ejemplo de respuesta

```json
{
  "totalJoyas": 3,
  "stockTotal": 6,
  "results": [
    {
      "name": "Collar Heart",
      "href": "http://localhost:5000/joyas/joya/1"
    },
    {
      "name": "Anillo Cuarzo Greece",
      "href": "http://localhost:5000/joyas/joya/6"
    },
    {
      "name": "Aros Hook Blue",
      "href": "http://localhost:5000/joyas/joya/4"
    }
  ]
}
```

**📌 Notas**

- El total de joyas (`stockTotal`) representa la cantidad total de joyas en la base de datos, sin paginar.
- El total de joyas en la página (`totalJoyas`) corresponde al número de resultados en esa página.
- Cada elemento en `results` incluye un `name` y un `href` que enlaza al detalle del recurso individual (`GET /joyas/joya/:id`).

#### ⚠️ Posibles respuestas de error

| Código | Motivo                     | Ejemplo de respuesta                   |
| ------ | -------------------------- | -------------------------------------- |
| 500    | Error interno del servidor | `{ "error": "Internal Server Error" }` |

### `GET /joyas/joya/:id`

Devuelve el detalle de una joya específica a través de su ID.

#### 🔸 Parámetros de consulta

| Parámetro | Tipo   | Descripción                                         |
| --------- | ------ | --------------------------------------------------- |
| `id`      | number | Identificador único de la joya en la base de datos. |

#### 🛸 Ejemplo de solicitud

```bash
GET http://localhost:5000/joyas/joya/1
```

#### 🆗 Ejemplo de respuesta

```json
[
  {
    "id": 1,
    "nombre": "Collar Heart",
    "categoria": "collar",
    "metal": "oro",
    "precio": 20000,
    "stock": 2
  }
]
```

#### ⚠️ Posibles respuestas de error

| Código | Motivo                        | Ejemplo de respuesta                             |
| ------ | ----------------------------- | ------------------------------------------------ |
| 400    | ID inválido o faltante        | `{ "error": "Invalid or missing id parameter" }` |
| 404    | Joya no encontrada con ese ID | `{ "error": "Joya not found" }`                  |
| 500    | Error interno del servidor    | `{ "error": "Internal Server Error" }`           |

### `GET /joyas/filtros`

Devuelve una lista de joyas filtradas según los parámetros de búsqueda enviados por query string.

#### 🔸 Parámetros de consulta (query string)

| Parámetro    | Tipo   | Descripción                                                               |
| ------------ | ------ | ------------------------------------------------------------------------- |
| `precio_min` | number | (Opcional) Precio mínimo para filtrar las joyas                           |
| `precio_max` | number | (Opcional) Precio máximo para filtrar las joyas                           |
| `categoria`  | string | (Opcional) Categoría de la joya (ej: `aros`, `collares`, `anillos`, etc.) |
| `metal`      | string | (Opcional) Tipo de metal (ej: `oro`, `plata`, `acero`)                    |

✅ Puedes combinar múltiples filtros en una sola solicitud.

🛸 Ejemplo de solicitud

```bash
GET http://localhost:5000/joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata
```

#### 🆗 Ejemplo de respuesta

```json
[
  {
    "id": 5,
    "nombre": "Anillo Wish",
    "categoria": "aros",
    "metal": "plata",
    "precio": 30000,
    "stock": 4
  }
]
```

#### ⚠️ Posibles respuestas de error

| Código | Motivo                     | Ejemplo de respuesta                   |
| ------ | -------------------------- | -------------------------------------- |
| 500    | Error interno del servidor | `{ "error": "Internal Server Error" }` |

## 📦 Dependencias

### Producción

| Dependencia | Versión | Badge                                                                  | Descripción                                                                                                                                              |
| ----------- | ------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cors        | 2.8.5   | ![cors](https://img.shields.io/badge/cors-2.8.5-blue)                  | Para habilitar el uso de **CORS** en el servidor. Se integra como un middleware en Express                                                               |
| dotenv      | 16.5.0  | ![dotenv](https://img.shields.io/badge/dotenv-16.5.0-green)            | Para gestionar variables de entorno de forma sencilla mediante un archivo `.env`                                                                         |
| express     | 5.1.0   | ![express](https://img.shields.io/badge/express-5.1.0-brightgreen)     | Para facilitar la creación de servidores y APIs web. Proporciona una estructura clara para definir rutas, middlewares, controladores y manejo de errores |
| pg          | 8.16.0  | ![pg](https://img.shields.io/badge/pg-8.16.0-yellow)                   | Para conectarse a bases de datos PostgreSQL y ejecutar consultas SQL desde el servidor                                                                   |
| pg-format   | 1.0.4   | ![pg-format](https://img.shields.io/badge/pg--format-1.0.4-blueviolet) | Para formatear consultas SQL dinámicas de forma segura, evitando inyecciones y facilitando estructuras como listas o identificadores                     |
| winston     | ^3.17.0 | ![winston](https://img.shields.io/badge/winston-^3.17.0-lightgrey)     | Para registrar logs del sistema con distintos niveles, formatos y destinos. Facilita el monitoreo y depuración del servidor                              |

### Desarrollo

| Dependencia | Versión | Badge                                                                   | Descripción                                                                           |
| ----------- | ------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| commitlint  | 19.8.1  | ![@commitlint/cli](https://img.shields.io/badge/commitlint-19.8.1-blue) | CLI para validar mensajes de commits según reglas definidas.                          |
| eslint      | 9.29.0  | ![eslint](https://img.shields.io/badge/eslint-9.29.0-brightgreen)       | Herramienta principal para analizar y mantener consistente el estilo del código.      |
| husky       | 8.0.0   | ![husky](https://img.shields.io/badge/husky-8.0.0-red)                  | Permite ejecutar hooks de Git (como validar commits o formatear antes de hacer push). |
| prettier    | 3.5.3   | ![prettier](https://img.shields.io/badge/prettier-3.5.3-pink)           | Formateador de código automático para mantener un estilo consistente.                 |

## 👥 Guía para el equipo

Este proyecto sigue un flujo de trabajo y convenciones definidos por el equipo de desarrollo. Por favor, revisa la [Guía de Contribución](./CONTRIBUTING.md) para conocer:

- Cómo crear ramas correctamente (`feature/`, `fix/`, `docs/`, etc.)
- La convención para redactar mensajes de `commit`
- El flujo sugerido para `Pull Requests` (PR)
- Buenas prácticas de trabajo colaborativo

📌 Este documento es exclusivo para uso interno del equipo de desarrollo.
