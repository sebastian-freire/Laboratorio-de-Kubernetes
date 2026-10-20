# Feedback de clases

Aplicación web mobile-first para que los alumnos opinen sobre **cada clase** a la que fueron y los docentes vean el resultado agregado y anónimo de **sus** materias.

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`frontend/`)
- **Backend:** Python + FastAPI + SQLAlchemy + Alembic (`backend/`)
- **Base de datos:** PostgreSQL 18 (en local, con Docker Compose)

Documentación: [arquitectura](docs/ARQUITECTURA.md) · [requisitos](docs/REQUISITOS.md) · [decisiones](docs/DECISIONES.md) · [progreso](docs/PROGRESO.md)

## Requisitos previos

| Herramienta | Versión | Para qué |
|-------------|---------|----------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | reciente | Base de datos local |
| [uv](https://docs.astral.sh/uv/getting-started/installation/) | 0.9 o superior | Python y dependencias del backend (instala Python 3.13 solo si falta) |
| [Node.js](https://nodejs.org/) | 22 LTS o superior | Frontend |

> **Recomendación:** cloná el repo **fuera de OneDrive o Dropbox**. La sincronización interfiere con `.git`, `.venv` y `node_modules`.

## Puesta en marcha (desde cero)

Todos los comandos se corren desde la raíz del repo, salvo que se indique otra cosa.

```bash
# 1. Variables de entorno: copiar el ejemplo y poner un JWT_SECRET propio
cp .env.example .env
#    Generar el secreto con:  python -c "import secrets; print(secrets.token_urlsafe(48))"

# 2. Base de datos (crea también la base de pruebas feedback_test)
docker compose up -d --wait

# 3. Backend: dependencias, migraciones y datos de ejemplo
cd backend
uv sync
uv run alembic upgrade head
uv run python -m app.seed
uv run uvicorn app.main:app --reload --port 8000
```

En otra terminal:

```bash
# 4. Frontend
cd frontend
npm install
npm run dev
```

- Aplicación: <http://localhost:5173>
- API: <http://localhost:8000> · Documentación interactiva (Swagger): <http://localhost:8000/docs>
- Salud: <http://localhost:8000/api/health> → `{"status":"ok","database":"ok"}`

> En PowerShell, `cp` funciona igual (es un alias de `Copy-Item`).

## Pruebas

Con la base levantada (`docker compose up -d --wait`):

```bash
cd backend
uv run pytest
```

Las pruebas usan la base `TEST_DATABASE_URL`, que **se borra en cada corrida**, nunca la de desarrollo.

## Comandos útiles

| Qué | Comando (en `backend/`) |
|-----|-------------------------|
| Aplicar migraciones | `uv run alembic upgrade head` |
| Crear una migración nueva tras cambiar `app/models.py` | `uv run alembic revision --autogenerate -m "descripcion"` |
| Recargar los datos de ejemplo (**borra todos los datos**) | `uv run python -m app.seed` |
| Lint del backend | `uv run ruff check .` |

| Qué | Comando (en `frontend/`) |
|-----|--------------------------|
| Build de producción | `npm run build` |
| Lint del frontend | `npm run lint` |

Para apagar la base: `docker compose down`. Para borrarla por completo (incluye los datos): `docker compose down -v`.

## Variables de entorno

Todas están documentadas en [`.env.example`](.env.example). El archivo `.env` está en el `.gitignore` y **nunca se commitea**.
