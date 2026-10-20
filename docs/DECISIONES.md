# Registro de decisiones

Una entrada por decisión. **Origen**: "Equipo (encuesta)" si la eligió el equipo; "Parámetro normal" si se aplicó sin preguntar según la sección 3.2 del documento del proyecto.

---

## D-001 — Organización de repositorios

- **Fecha:** 2026-10-20 · **Fase:** 0
- **Pregunta:** ¿Monorepo o repos separados?
- **Opciones:** Monorepo · Repos separados
- **Elegida:** Monorepo (frontend y backend en un solo repo, en carpetas separadas)
- **Motivo:** Un solo lugar para clonar y documentar, y una sola pipeline en la etapa siguiente.
- **Origen:** Equipo (encuesta)

## D-002 — Flujo de Git

- **Fecha:** 2026-10-20 · **Fase:** 0
- **Pregunta:** ¿Qué flujo de Git usa el equipo?
- **Opciones:** Ramas + Pull Request · Directo en `main` · Ramas sin PR obligatorio
- **Elegida:** Ramas por funcionalidad + Pull Request revisado antes de mergear a `main`
- **Motivo:** Evita que cinco personas se pisen y que `main` quede roto.
- **Origen:** Equipo (encuesta)

## D-003 — Formato de commits

- **Fecha:** 2026-10-20 · **Fase:** 0
- **Pregunta:** ¿Qué formato usamos para los mensajes de commit?
- **Opciones:** Conventional Commits · Libre en español
- **Elegida:** Libre en español (mensajes descriptivos, sin prefijos obligatorios)
- **Motivo:** Cero curva de aprendizaje para el equipo.
- **Origen:** Equipo (encuesta)

## D-004 — Reparto de tareas

- **Fecha:** 2026-10-20 · **Fase:** 0
- **Pregunta:** ¿El asistente propone un reparto de tareas al final de la Fase 2?
- **Opciones:** Sí, proponer reparto · No, lo organiza el equipo
- **Elegida:** No: el equipo se organiza por su cuenta
- **Motivo:** El equipo prefiere repartir el trabajo internamente.
- **Origen:** Equipo (encuesta)

## D-005 — Repositorio Git local y rama principal

- **Fecha:** 2026-10-20 · **Fase:** 0
- **Decisión:** Se inicializa Git en la carpeta del proyecto con rama principal `main` y un `.gitignore` básico. El primer commit (documentación de la Fase 0) va directo a `main` porque hace falta una base para abrir ramas.
- **Motivo:** Necesario para trabajar con ramas + PR (D-002).
- **Origen:** Parámetro normal
