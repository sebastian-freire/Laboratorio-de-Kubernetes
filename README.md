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

## Usuarios de prueba (seed)

Todos usan la contraseña definida en `SEED_USER_PASSWORD` (por defecto `demo1234`). Son datos ficticios con el dominio reservado `example.com`.

| Email | Roles | Para probar |
|-------|-------|-------------|
| `admin@example.com` | Admin | Materias, generación de clases, docentes y usuarios |
| `laura.martinez@example.com` | Docente + Admin | Selector de rol; docente de Bases de Datos |
| `sofia.rodriguez@example.com` | Docente | Segunda docente de Bases de Datos (misma vista que Laura) |
| `diego.fernandez@example.com` | Docente | Programación Web y Redes; comparación entre materias |
| `lucia.gomez@example.com` | Alumna | Inscripta en las 3 materias, con clases abiertas sin responder |
| `mateo.silva@example.com`, `valentina.perez@example.com`, `santiago.lopez@example.com`, `camila.sosa@example.com`, `joaquin.diaz@example.com`, `martina.castro@example.com`, `bruno.vazquez@example.com`, `agustina.romero@example.com` | Alumnos | Inscriptos en distintas materias |
| `tomas.alvarez@example.com` | Alumno | Sin materias: probar la inscripción con un código |

Códigos de inscripción: Bases de Datos `BASES226`, Programación Web `WEBDEV26`, Redes de Computadoras `REDES226`.

Las fechas del seed son relativas al día en que se corre (10 semanas antes y 5 después), así siempre hay clases cerradas, abiertas y futuras. Volver a correrlo **borra todos los datos** y los recarga.

## Pruebas

Con la base levantada (`docker compose up -d --wait`):

```bash
cd backend
uv run pytest
```

Las pruebas usan la base `TEST_DATABASE_URL`, que **se borra en cada corrida**, nunca la de desarrollo. Cubren autenticación, reglas de negocio (duplicados, plazos, autorización por materia, anonimato, promedios), administración, extras y el seed (82 pruebas).

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

## Problemas comunes

| Síntoma | Causa y solución |
|---------|------------------|
| `failed to connect to the docker API` | Docker Desktop no está abierto. Abrilo y esperá a que diga *Engine running*. |
| El frontend dice "No hay conexión con el servidor" | El backend no está corriendo, o `VITE_API_URL` no coincide con su puerto. Si cambiás el `.env`, reiniciá `npm run dev`. |
| Un cambio en el backend no aparece | En carpetas sincronizadas (OneDrive), `--reload` a veces no detecta cambios: reiniciá `uvicorn`. |
| CORS bloquea las requests | Agregá el origen del frontend a `CORS_ORIGINS` en el `.env` y reiniciá el backend. |
| Las pruebas fallan con "Falta TEST_DATABASE_URL" | Falta esa variable en el `.env` (copiala de `.env.example`). |

## Variables de entorno

Todas están documentadas en [`.env.example`](.env.example). El archivo `.env` está en el `.gitignore` y **nunca se commitea**.
