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

---

# Fase 1 — Definición funcional (2026-10-20)

Todas con **Origen: Equipo (encuesta)**.

| ID | Pregunta | Opciones consideradas | Elegida | Motivo |
|----|----------|-----------------------|---------|--------|
| D-006 | ¿Quién crea materias y clases? | Seed · Docente desde la app · Rol administrador | **Rol administrador** | El equipo quiere gestión desde la app con un rol dedicado. |
| D-007 | ¿Qué es "clase a la que fue"? | Inscripto + clase dictada · Código de asistencia · Código + QR | **Inscripto + clase ya dictada** | Lo más simple; no verifica la asistencia real. |
| D-008 | ¿Cómo se inscribe un alumno? | Seed · Autoinscripción con código · Docente agrega alumnos | **Autoinscripción con código de materia** | Más realista que el seed, con solo una pantalla y un endpoint. |
| D-009 | ¿Se bloquean clases futuras? | Bloquear · Permitir siempre | **Bloquear hasta el día de la clase** | Tiene sentido funcional y es fácil de probar. |
| D-010 | ¿El admin ve feedback? | No, solo gestiona · Ve lo agregado de todo | **No, solo gestiona** | Menos permisos que probar y más anonimato. |
| D-011 | ¿Docentes por materia? | Uno · Varios | **Varios por materia** | Contempla titulares y ayudantes; requiere tabla intermedia. |
| D-012 | ¿Cómo se cargan las clases? | Una por una · Generar por calendario · Ambas | **Generar por calendario** (días de la semana + rango) | Comodidad para cargar un semestre entero. |
| D-013 | ¿Código de inscripción? | Automático · Lo escribe el admin | **Automático, visible para admin y docentes** | Sin colisiones ni carga manual. |
| D-014 | ¿Escala de calificación? | 1–5 estrellas · 1–10 · 1–5 caritas | **1 a 5 con caritas** | Más expresiva; internamente es un entero 1–5. |
| D-015 | ¿Campos de texto obligatorios? | Opcionales · Al menos uno · Ambos | **Opcionales, máx. 500 caracteres** | Menos fricción, más respuestas. |
| D-016 | ¿Plazo de edición? | 24 h · 48 h · 7 días · Configurable por materia | **7 días** (valor global configurable por variable de entorno) | Alcanza hasta la clase siguiente en materias semanales. |
| D-017 | ¿Qué pasa al vencer el plazo? | Cerrado · Crear sí, editar no | **Cerrado: ni crear ni editar** | Una sola regla para ambas acciones. |
| D-018 | ¿Cómo se garantiza el anonimato? | A: id guardado sin exponer · B: participación separada + HMAC | **A: id guardado, nunca expuesto al docente** | Lo más simple; se verifica con pruebas. Quien acceda a la base sí ve los autores. |
| D-019 | ¿Umbral mínimo de respuestas? | 3 para todo · 3 para comentarios · Sin umbral | **Sin umbral** | Elección del equipo; se acepta que en clases chicas se pueda deducir el autor. |
| D-020 | ¿Info temporal en los comentarios? | Ninguna + orden aleatorio · Fecha y hora | **Ninguna, orden aleatorio** | Evita deducir el autor por el horario. |
| D-021 | ¿Cómo se muestra la tendencia? | Gráfico + tabla · Solo gráfico · Solo tabla | **Gráfico de línea + tabla** | Lectura rápida en el celular y valores exactos. |
| D-022 | ¿Fecha u hora en las clases? | Solo fecha · Fecha y hora de inicio | **Solo fecha**: ventana de 00:00 del día de la clase a 23:59:59 del día +7 | Regla clara y fácil de probar. |
| D-023 | ¿El admin ajusta las clases generadas? | Eliminar sueltas · Eliminar y agregar · Solo generar | **Eliminar clases sueltas sin feedback** | Cubre feriados con un endpoint más. |
| D-024 | ¿El alumno puede borrar su feedback? | No · Sí, dentro del plazo | **No, solo editar** | Una acción menos que construir y probar. |
| D-025 | ¿El alumno puede desinscribirse? | No · Sí | **No, la inscripción es permanente** | Alcanza para el MVP. |

## D-026 — Roles por usuario

- **Fecha:** 2026-10-20 · **Fase:** 1 · **Origen:** Equipo (encuesta)
- **Pregunta:** ¿Cada usuario tiene un solo rol?
- **Opciones:** Un rol por cuenta · Varios roles
- **Elegida:** **Varios roles por usuario.**
- **Motivo:** Una persona puede ser, por ejemplo, docente y admin con una sola cuenta.

## D-027 — Varias clases el mismo día y cómo se distinguen

- **Fecha:** 2026-10-20 · **Fase:** 1 · **Origen:** Equipo (encuesta)
- **Preguntas:** ¿Puede haber varias clases por día? ¿Cómo se distinguen?
- **Opciones:** Máximo una por día · Varias por día. Para distinguirlas: hora de inicio informativa · etiqueta de turno · hora que también define la ventana.
- **Elegida:** **Varias por día, distinguidas por hora de inicio informativa.** La ventana de feedback sigue contando por fecha (D-022). El calendario se genera con reglas "día de la semana + hora". La clave única es (materia, fecha, hora).
- **Motivo:** Materias con dos turnos el mismo día, sin cambiar la regla del plazo.

## D-028 — Cambio de rol en la interfaz y conflicto de interés

- **Fecha:** 2026-10-20 · **Fase:** 1 · **Origen:** Equipo (encuesta)
- **Cambio de rol** (opciones: selector en el menú · elegir al iniciar sesión · todo junto): **selector de rol en el menú.** El backend autoriza por los roles del usuario autenticado; el rol activo es solo una vista del frontend.
- **Docente que se inscribe como alumno en su materia** (opciones: bloquear · permitir): **se bloquea**, y por coherencia tampoco se puede asignar como docente a un alumno ya inscripto en esa materia.
- **Motivo:** Evitar que un docente califique su propia clase.

## D-029 — Zona horaria por defecto

- **Fecha:** 2026-10-20 · **Fase:** 1 · **Origen:** Equipo (encuesta)
- **Opciones:** `America/Argentina/Buenos_Aires` · `America/Montevideo`
- **Elegida:** **`America/Montevideo`**, configurable por variable de entorno.
- **Motivo:** Elección del equipo.
