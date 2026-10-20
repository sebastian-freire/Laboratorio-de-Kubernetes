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

---

## D-030 — Autorización para continuar sin encuestas

- **Fecha:** 2026-10-20 · **Fase:** checkpoint de la Fase 1 · **Origen:** Equipo
- **Decisión:** el equipo indicó: *"Seguí con todas las fases en base a los requisitos que tenés, podés continuar sin preguntar más, hacé todo"*. Desde aquí el asistente toma las decisiones pendientes eligiendo la opción que habría marcado como **(Recomendado)** y las registra con **Origen: Asistente (autorizado por D-030)**. Incluye los extras de la Fase 6.
- **Flujo de ramas sin remoto** (opciones: mergear en local · dejar ramas abiertas · configurar remoto): **una rama por fase, mergeada a `main` en local al cerrarla.** Los PR empiezan cuando exista el remoto.

---

# Fase 2 — Arquitectura (2026-10-20)

Todas con **Origen: Asistente (autorizado por D-030)**.

| ID | Pregunta | Opciones consideradas | Elegida | Motivo |
|----|----------|-----------------------|---------|--------|
| D-031 | Frontend | React + Vite · Vue + Vite · Svelte · SSR simple | **React + Vite + TypeScript** | El más documentado; TypeScript atrapa errores antes de correr. |
| D-032 | Backend | Node/Express · NestJS · Python/FastAPI · Spring Boot · Go | **Python + FastAPI** | Swagger/OpenAPI automático, validación con Pydantic y pruebas simples con pytest. |
| D-033 | Base de datos | PostgreSQL · MySQL/MariaDB · MongoDB | **PostgreSQL 18** | Relacional (el dominio lo es), restricciones únicas y CHECK, imagen oficial estable. |
| D-034 | ORM y migraciones | SQLAlchemy + Alembic · SQL a mano · SQLModel | **SQLAlchemy 2 (síncrono) + Alembic** | Estándar en Python; migraciones versionadas con un comando. Síncrono es más fácil de depurar. |
| D-035 | UI / CSS mobile-first | Tailwind CSS · Pico CSS · MUI · CSS propio | **Tailwind CSS 4** | Utilidades mobile-first sin escribir CSS aparte; sin componentes pesados. |
| D-036 | Gráficos | Recharts · Chart.js · tabla sin librería | **Recharts** | Componentes React nativos para el gráfico de línea (D-021). |
| D-037 | Autenticación | Email + contraseña + JWT · Sesiones con cookie · Proveedor externo | **Email + contraseña, JWT Bearer (8 h)** | Sin estado en el servidor (simple para escalar en Kubernetes) y el botón *Authorize* de Swagger funciona. |
| D-038 | Creación de cuentas | Seed · Registro abierto · Invitación | **Alumnos: registro abierto (rol alumno). Docentes y admins: los crea un admin desde la app. Primer admin: seed.** | Encaja con la autoinscripción (D-008) y con el rol admin (D-006). |
| D-039 | Hash de contraseñas | Argon2 · bcrypt | **Argon2 (pwdlib)** | Lo que recomienda la documentación actual de FastAPI. |
| D-040 | Idioma | Código en inglés · Código en español | **Interfaz en español; código, API y base en inglés** | Convención de los frameworks y de las librerías; el glosario de ARQUITECTURA.md mapea los términos. |
| D-041 | Gestor de paquetes Python | uv · pip + requirements.txt · Poetry | **uv** (ya instalado) | Instalación rápida y lockfile reproducible; `uv run pytest` es el comando único de pruebas. |
| D-042 | Dónde vive el token en el frontend | localStorage · cookie httpOnly | **localStorage** | Lo más simple con JWT Bearer; el riesgo de XSS se mitiga porque React escapa el contenido y no se usa `dangerouslySetInnerHTML`. |

---

# Fase 3 — Esqueleto y entorno local (2026-10-20)

| ID | Pregunta | Opciones consideradas | Elegida | Motivo | Origen |
|----|----------|-----------------------|---------|--------|--------|
| D-043 | ¿Cómo se corre la base en local? | Docker Compose solo para la base · PostgreSQL instalado · Base en la nube | **Docker Compose solo para PostgreSQL** (`postgres:18-alpine`) | Mismo entorno para los cinco con un comando; nada que instalar aparte de Docker. | Asistente (D-030) |
| D-044 | ¿Dónde viven las variables de entorno? | Un `.env` en la raíz · Un `.env` por componente | **Un único `.env` en la raíz** (lo leen Compose, el backend y Vite con `envDir: '..'`) | Un solo archivo que copiar y completar. | Parámetro normal |
| D-045 | ¿Contra qué base corren las pruebas? | Base PostgreSQL de pruebas separada · SQLite en memoria | **PostgreSQL de pruebas separada** (`feedback_test`, creada por el script de init del contenedor) | Mismas restricciones y tipos que en producción; la de desarrollo nunca se toca. | Asistente (D-030) |
| D-046 | Estilo de dependencias de FastAPI | `Annotated[...]` · `= Depends()` en argumentos | **`Annotated`** | Estilo recomendado por FastAPI; deja pasar el lint (ruff B008) sin excepciones. | Parámetro normal |

---

# Fase 4 — Backend y base de datos (2026-10-20)

| ID | Pregunta | Opciones consideradas | Elegida | Motivo | Origen |
|----|----------|-----------------------|---------|--------|--------|
| D-047 | Códigos HTTP de error | 400 para validaciones · 422 (default de FastAPI) | **422 para validaciones; 403 para plazo cerrado o clase futura; 409 para duplicados y conflictos; 404 para recursos ajenos o inexistentes** | Coherente con FastAPI; el mensaje en español va en `detail` para que el frontend lo muestre tal cual. | Asistente (D-030) |
| D-048 | Datos del seed | Fechas fijas · Fechas relativas al día de ejecución | **Contenido fijo (semilla aleatoria 2026) y fechas relativas a hoy** (10 semanas antes, 5 después) | Siempre hay clases cerradas, abiertas y futuras para la demo. | Asistente (D-030) |
| D-049 | Dominio de los emails del seed | `.test` · `example.com` | **`example.com`** | Reservado para ejemplos (RFC 2606); el validador de emails rechaza `.test`. | Parámetro normal |
| D-050 | Gestión de roles por el admin | — | **Un admin no puede quitarse su propio rol de admin; quitar el rol docente desasigna de las materias** | Evita quedarse sin admins y docentes "fantasma" en las materias. | Asistente (D-030) |
| D-051 | Usuario de prueba con varios roles | — | **Laura Martínez es docente y admin** | Permite probar el selector de rol (D-028). | Parámetro normal |

---

# Fase 5 — Frontend mobile-first (2026-10-20)

| ID | Pregunta | Opciones consideradas | Elegida | Motivo | Origen |
|----|----------|-----------------------|---------|--------|--------|
| D-052 | Estilo visual | Genérico de librería · Identidad propia | **"Aula": tinta azul `#1B2541`, verde pizarrón `#16805A`, amarillo resaltador para lo que espera acción del alumno, rojo corrección para errores; las caritas como elemento distintivo** | Ligado al tema (clases), alto contraste y legible en el celular. Color de la línea del gráfico validado con el validador de paletas (claro y oscuro). | Asistente (D-030) |
| D-053 | Cómo carga el formulario una clase suelta | Recorrer todas las materias · Endpoint nuevo | **Nuevo `GET /api/student/classes/{id}`** (con pruebas) | Una request en lugar de N; reutiliza la autorización por inscripción. | Asistente (D-030) |
| D-054 | Tipografía | Google Fonts por CDN · Fuente autoalojada | **Atkinson Hyperlegible Next autoalojada (`@fontsource-variable`)** | Diseñada para legibilidad; sin depender de servicios externos en el cluster. | Asistente (D-030) |
| D-055 | Modo oscuro | No · Automático según el sistema | **Automático (`prefers-color-scheme`)** con tokens propios | Mismo esfuerzo con variables CSS; colores del gráfico validados contra el fondo oscuro. | Asistente (D-030) |
| D-056 | Peso del bundle | Todo junto · Carga diferida del gráfico | **La pantalla con Recharts se carga diferida** | El bundle inicial baja de ~650 kB a ~300 kB; alumnos y admins no descargan la librería de gráficos. | Parámetro normal |
| D-057 | Clases sin respuestas en el gráfico | Puntos en 0 · Unir con línea · Omitir | **Se omiten del gráfico y figuran en la tabla con "–"** | Una clase sin datos no es un promedio de cero. | Asistente (D-030) |
