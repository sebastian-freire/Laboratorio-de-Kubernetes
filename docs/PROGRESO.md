# Progreso del proyecto: Feedback de clases

**Fase actual:** 0, Arranque (terminada, esperando checkpoint)
**Última actualización:** 2026-10-20

## Estado por fase

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Arranque | ✅ Hecha (falta el checkpoint) |
| 1 | Definición funcional (sin código) | ⏳ Pendiente |
| 2 | Arquitectura (antes de programar) | ⏳ Pendiente |
| 3 | Esqueleto y entorno local | ⏳ Pendiente |
| 4 | Backend y base de datos | ⏳ Pendiente |
| 5 | Frontend mobile-first | ⏳ Pendiente |
| 6 | Extras (opcional) | ⏳ Pendiente |
| 7 | Cierre de la etapa | ⏳ Pendiente |

## Hecho

- Revisión inicial: la carpeta no tenía repositorio Git ni código; solo el documento del proyecto.
- Decisiones de organización del equipo (ver `docs/DECISIONES.md`, D-001 a D-005).
- Repositorio Git local inicializado (rama `main`) con `.gitignore`.
- Creados `docs/DECISIONES.md` y `docs/PROGRESO.md`.

## Falta

- Fase 1: encuestas de definición funcional y `docs/REQUISITOS.md`.
- Todo lo de las fases 2 a 7.

## Preguntas pendientes

- **Remoto Git:** ¿dónde va a estar alojado el repo (GitHub, GitLab, servidor del laboratorio)? Hace falta para trabajar con Pull Requests. Lo crea el equipo; el asistente no publica nada sin confirmación.
- **Carpeta en OneDrive:** el proyecto está dentro de OneDrive. La sincronización puede chocar con `.git` y con carpetas pesadas como `node_modules` o entornos virtuales. Conviene que cada integrante clone el repo en una carpeta fuera de OneDrive.

## Fuera de alcance en esta etapa (sección 2.1)

- Manifiestos de Kubernetes, Helm, Kustomize, Ingress, volúmenes.
- `Jenkinsfile`, configuración de Jenkins y registry de imágenes.
- `Dockerfile`s de producción.
- Dominio, URL pública y TLS.
