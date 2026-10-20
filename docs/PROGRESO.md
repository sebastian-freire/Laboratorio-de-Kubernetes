# Progreso del proyecto: Feedback de clases

**Fase actual:** 4, Backend y base de datos (en curso)
**Última actualización:** 2026-10-20

## Estado por fase

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Arranque | ✅ Hecha |
| 1 | Definición funcional (sin código) | ✅ Hecha |
| 2 | Arquitectura (antes de programar) | ✅ Hecha |
| 3 | Esqueleto y entorno local | ✅ Hecha |
| 4 | Backend y base de datos | 🔄 En curso |
| 5 | Frontend mobile-first | ⏳ Pendiente |
| 6 | Extras (opcional) | ⏳ Pendiente |
| 7 | Cierre de la etapa | ⏳ Pendiente |

## Hecho

- Revisión inicial: la carpeta no tenía repositorio Git ni código; solo el documento del proyecto.
- Decisiones de organización del equipo (ver `docs/DECISIONES.md`, D-001 a D-005).
- Repositorio Git local inicializado (rama `main`) con `.gitignore`.
- Creados `docs/DECISIONES.md` y `docs/PROGRESO.md`.
- Fase 1: definición funcional por encuestas (D-006 a D-029) y `docs/REQUISITOS.md` con glosario, reglas R1–R11, historias de usuario por rol y casos borde.
- Checkpoint de la Fase 1: el equipo autorizó continuar todas las fases sin encuestas (D-030).
- Fase 2: stack y autenticación (D-031 a D-042) y `docs/ARQUITECTURA.md` (versión inicial, antes de programar), commiteado antes de escribir código.
- Fase 3: `docker-compose.yml` (solo PostgreSQL, con base de pruebas), `.env.example`, backend FastAPI con `GET /api/health` y su prueba, Alembic configurado, frontend React + Vite + Tailwind con una página que consume el health check, y `README.md`.

## Falta

- Fase 4: migraciones, seed, autenticación, endpoints y pruebas.
- Fases 5 a 7.

## Preguntas pendientes

- **Remoto Git:** ¿dónde va a estar alojado el repo (GitHub, GitLab, servidor del laboratorio)? Hace falta para trabajar con Pull Requests. Lo crea el equipo; el asistente no publica nada sin confirmación.
- **Carpeta en OneDrive:** el proyecto está dentro de OneDrive. La sincronización puede chocar con `.git` y con carpetas pesadas como `node_modules` o entornos virtuales. Conviene que cada integrante clone el repo en una carpeta fuera de OneDrive.

## Fuera de alcance en esta etapa (sección 2.1)

- Manifiestos de Kubernetes, Helm, Kustomize, Ingress, volúmenes.
- `Jenkinsfile`, configuración de Jenkins y registry de imágenes.
- `Dockerfile`s de producción.
- Dominio, URL pública y TLS.
