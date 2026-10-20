# Progreso del proyecto: Feedback de clases

**Fase actual:** etapa de desarrollo terminada (fases 0 a 7); falta la confirmación final del equipo
**Última actualización:** 2026-10-20

## Estado por fase

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Arranque | ✅ Hecha |
| 1 | Definición funcional (sin código) | ✅ Hecha |
| 2 | Arquitectura (antes de programar) | ✅ Hecha |
| 3 | Esqueleto y entorno local | ✅ Hecha |
| 4 | Backend y base de datos | ✅ Hecha |
| 5 | Frontend mobile-first | ✅ Hecha |
| 6 | Extras (opcional) | ✅ Hecha |
| 7 | Cierre de la etapa | ✅ Hecha |

## Hecho

- **Fase 0:** la carpeta no tenía repositorio Git ni código. Se inicializó Git (`main`) y se tomaron las decisiones de organización (D-001 a D-005).
- **Fase 1:** definición funcional por encuestas (D-006 a D-029) y `docs/REQUISITOS.md` con glosario, reglas R1 a R11, historias de usuario y casos borde. En el checkpoint, el equipo autorizó seguir sin encuestas (D-030).
- **Fase 2:** stack y autenticación (D-031 a D-042) y `docs/ARQUITECTURA.md`, commiteado antes de escribir código.
- **Fase 3:** Docker Compose con PostgreSQL y base de pruebas, `.env.example`, `GET /api/health`, página mínima que lo consume, Alembic y `README.md`.
- **Fase 4:** modelo y migración inicial, seed reproducible, JWT con roles múltiples, endpoints de alumno, docente y admin con Swagger en `/docs`, y reglas de negocio en el backend. Las pruebas detectaron y se corrigió un bug en el promedio por materia.
- **Fase 5:** frontend mobile-first para los tres roles. Probado a 360, 375 y 414 px, en modo claro y oscuro.
- **Fase 6:** planilla CSV, palabras más repetidas y comparación entre materias.
- **Fase 7:** verificación desde cero en un clon limpio fuera de OneDrive, siguiendo solo el README: base, migraciones, seed, 82 pruebas en verde, build y lint del frontend, recorrido de los tres roles en el navegador, descarga del CSV y sesión vencida. Se agregaron al README los usuarios de prueba y una sección de problemas comunes.

## Checklist contra los requisitos (sección 1.1)

| # | Requisito | Cumple | Evidencia |
|---|-----------|--------|-----------|
| 1 | Web usable desde el celular, con frontend, backend con API y base de datos | ✅ | `frontend/` (React, mobile-first), `backend/` (FastAPI, `/docs`), `docker-compose.yml` (PostgreSQL). Capturas a 360, 375 y 414 px sin scroll horizontal; elementos táctiles de 40 px de alto o más (filas y botones principales de 48 a 64 px). |
| 2 | Datos que persisten en la base | ✅ | Todo vive en PostgreSQL (volumen `pgdata`). Migraciones en `backend/alembic/versions/`. Sobrevive a reiniciar backend y contenedor (`docker compose stop/start`). |
| 3 | Al menos dos roles (uno usa la app, otro ve lo agregado) | ✅ | Alumno, Docente y Admin (`app/models.py`: `Role`). Autorización en `app/deps.py`. Pruebas: `tests/test_teacher.py`, `tests/test_admin.py`, `tests/test_student.py::test_student_cannot_use_teacher_or_admin_endpoints`. |
| 4 | Pruebas automatizadas del backend con un solo comando | ✅ | `cd backend && uv run pytest` da 82 pruebas en verde. Cubre duplicados, plazos (incluido el límite del día 7/8), docente sin acceso a otra materia, anonimato, promedios, admin y extras. |
| 5 | Documento de arquitectura con diagrama, escrito antes de programar | ✅ | `docs/ARQUITECTURA.md` (diagramas Mermaid de componentes y ER) con la marca "Versión inicial: escrita antes de programar". Se commiteó (`7c042ed`) antes del primer código (`ef29642`). Los agregados posteriores están marcados con ¹ y ². |

Reglas del problema (sección 1.3):

| Regla | Evidencia |
|-------|-----------|
| Un solo feedback por clase | Restricción única `uq_feedback_student_class` + 409. `test_second_feedback_for_the_same_class_is_rejected`, `test_database_rejects_duplicate_feedback_even_without_the_api` |
| Editable hasta un plazo (7 días) | `app/feedback_window.py`. `test_edit_feedback_after_the_window_is_rejected`, `test_feedback_on_the_last_day_of_the_window_is_accepted` |
| El docente ve solo sus materias | Filtro por usuario autenticado. `test_teacher_cannot_see_summary_of_another_subject` y otras |
| El docente no sabe quién escribió qué | Esquema `AnonymousFeedbackOut`, orden aleatorio y sin fechas. `test_comments_never_include_author_data`, `test_export_csv_contains_anonymous_rows` |
| Promedio por clase, tendencia y comentarios | `GET /api/teacher/subjects/{id}/summary`, gráfico y tabla. `test_summary_computes_average_per_class_and_overall` |

## Riesgos y limitaciones conocidas (aceptados por decisiones del equipo)

- **Sin umbral mínimo de respuestas (D-019):** en una clase con una sola respuesta, el docente ve la nota y el comentario de esa persona.
- **Anonimato opción A (D-018):** quien tenga acceso directo a la base de datos puede ver quién escribió cada feedback.
- **"Clase a la que fue" = inscripto (D-007):** no se verifica la asistencia real.
- **Token en localStorage (D-042):** depende de que no haya XSS. React escapa el contenido y no se usa HTML crudo.
- **Sin límite de intentos de login:** conviene agregarlo antes de exponer la app públicamente (por ejemplo, en el Ingress).

## Preguntas pendientes

- **Remoto Git:** ¿dónde se aloja el repo (GitHub, GitLab, servidor del laboratorio)? Hace falta para los Pull Requests (D-002). Mientras tanto, cada fase se mergeó a `main` en local. El asistente no publica nada sin confirmación.
- **Archivo `team3.kubeconfig`:** apareció en la carpeta durante la Fase 3. Está en el `.gitignore` (`*.kubeconfig`); no se commiteó ni se leyó.
- **Carpeta en OneDrive:** la sincronización interfiere con `.git`, `.venv`, `node_modules` y con el `--reload` de uvicorn. Conviene trabajar en un clon fuera de OneDrive.

## Pendiente para la etapa de despliegue

Quedó fuera de alcance a propósito (sección 2.1). La app ya está preparada: toda la configuración va por variables de entorno, tiene health check, las migraciones y el seed corren con un comando y las pruebas también.

**Contenedores**
- `Dockerfile` del backend (Python 3.13 + uv, `uvicorn app.main:app --host 0.0.0.0`, usuario no root).
- `Dockerfile` del frontend: `npm run build` y servir `dist/` con un servidor estático (por ejemplo nginx), con fallback a `index.html` para las rutas de la SPA.
- `VITE_API_URL` se fija **al construir** la imagen. Lo más simple es servir frontend y API bajo el mismo dominio (Ingress que manda `/api` al backend) y construir con `VITE_API_URL` vacío.

**Kubernetes**
- Namespace, Deployments y Services de frontend y backend, e Ingress con la URL pública y TLS.
- PostgreSQL: StatefulSet con volumen persistente o una base provista por el laboratorio (hace falta saber la `StorageClass`).
- Migraciones como Job o initContainer (`alembic upgrade head`) antes de cada versión. El seed, solo para la demo.
- Secrets: `JWT_SECRET`, contraseña de la base y `DATABASE_URL`. ConfigMap: `CORS_ORIGINS` (la URL pública), `APP_TIMEZONE`, `FEEDBACK_WINDOW_DAYS`.
- Probes: `GET /api/health` como readiness. Para liveness conviene un endpoint que no dependa de la base, para que una caída de la base no reinicie los pods en cadena.

**Jenkins**
- Etapas: lint y pruebas del backend (necesitan un PostgreSQL efímero: contenedor de servicio o sidecar, y `TEST_DATABASE_URL`), lint y build del frontend, construcción y push de imágenes, despliegue.

**Datos del laboratorio que faltan**
- Nombre del namespace y permisos (el kubeconfig del equipo existe, pero no se revisó).
- URL y credenciales del registry de imágenes.
- Dominio o URL pública asignada y cómo se gestiona TLS.
- `StorageClass` disponible o base de datos provista.
- URL de Jenkins, credenciales y cómo accede al cluster.

## Fuera de alcance en esta etapa (sección 2.1)

- Manifiestos de Kubernetes, Helm, Kustomize, Ingress, volúmenes.
- `Jenkinsfile`, configuración de Jenkins y registry de imágenes.
- `Dockerfile`s de producción.
- Dominio, URL pública y TLS.
