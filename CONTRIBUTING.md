# 🛠️ Guía de Contribución (Uso Interno del Equipo)

Este documento define las prácticas y convenciones internas para trabajar de forma colaborativa y eficiente en este proyecto.  
El objetivo es asegurar un flujo de trabajo coherente, organizado y trazable entre todos los miembros del equipo.

## 🌱 Estructura de ramas

Para mantener un historial de ramas limpio y comprensible, seguimos una convención basada en prefijos:

- `feature/` → Nuevas funcionalidades o endpoints.
- `fix/` → Correcciones de errores o bugs.
- `docs/` → Documentación técnica o de usuario.

### ✅ Ejemplos de nombres de rama

- `feature/paginacion-joyas`
- `fix/joya-id-invalido`
- `docs/estructura-readme`

### Crear nueva rama a partir de `main`:

```bash
git checkout -b feature/nombre-de-la-feature
```

## 🧾 Convención de mensajes de commit

Utilizamos la convención _[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)_ para facilitar el seguimiento de cambios, generación de changelogs y automatización.

```plaintext
<tipo>(opcional: alcance): descripción breve
```

💡 Escribe en minúsculas, en modo imperativo (ej: agregar, corregir, modificar, no agregado, corrigió).

### Tipos comunes

| Tipo       | Uso previsto                                              |
| ---------- | --------------------------------------------------------- |
| `feat`     | Agrega una nueva funcionalidad                            |
| `fix`      | Corrige un bug o comportamiento inesperado                |
| `docs`     | Cambios en documentación (`README.md`, comentarios, etc.) |
| `style`    | Cambios de formato sin modificar lógica                   |
| `refactor` | Mejora del código sin agregar ni corregir funcionalidad   |
| `test`     | Agrega o modifica tests                                   |
| `chore`    | Tareas menores (configs, scripts, herramientas, etc.)     |

### ✍️ Ejemplos válidos

```bash
feat: agregar endpoint GET /joyas con paginación
refactor: extraer helper para parsear query params
docs: actualizar tabla de rutas en el README
fix: manejar error si joya no existe por id
```

## ✅ Flujo de trabajo interno

### 1. Crear rama nueva desde `main`

```bash
git checkout -b feature/nombre-de-la-feature
```

### 2. Hacer commits atómicos y claros, siguiendo la convención

- Evitar commits genéricos como `update` o `changes`.
- Cada `commit` debe representar un cambio lógico e independiente.

### 3. `Push` de la nueva rama al repositorio remoto

```bash
git push -u origin feature/nombre-de-la-feature
```

### 4. Crear un `Pull Request` (PR) hacia `main`

- Hacer el `PR` hacia la rama main.
- Incluir:
  - Objetivo general del cambio.
  - Referencia a `issue` (si aplica).
  - Screenshots u otras evidencias si el cambio lo requiere.

---

### 📌 Recomendaciones de buenas prácticas

- 🔄 Mantener la rama actualizada con `main` regularmente.

```bash
git pull origin main
```

- 🧪 Validar que los cambios no rompen el proyecto.

```bash
npm run dev # o ejecutar tests si los hay
```

- 🔍 No incluir cambios no relacionados en un mismo `commit`.
- 📦 Divide cambios grandes en PRs más pequeños y manejables.

---

📎 Este documento es de uso interno y obligatorio para todos los colaboradores del equipo técnico.
Para sugerencias o mejoras, conversarlo con el equipo responsable del repositorio.
