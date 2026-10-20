# Requisitos: Feedback de clases

**Versión:** 1.0 (Fase 1) · **Fecha:** 2026-10-20
Las decisiones que sustentan cada regla están en [`DECISIONES.md`](DECISIONES.md), entradas D-006 a D-029.

---

## 1. Glosario

- **Materia:** curso con uno o más docentes, un código de inscripción y un conjunto de clases.
- **Clase:** una instancia de la materia en una **fecha y hora de inicio**. La hora es informativa (sirve para distinguir varias clases del mismo día); no hay dos clases de la misma materia con igual fecha y hora.
- **Feedback:** opinión de un alumno sobre una clase: una **calificación de 1 a 5 (caritas)**, "qué gustó" y "qué no gustó" (opcionales, hasta 500 caracteres cada uno).
- **Ventana de feedback de una clase:** desde las 00:00 del día de la clase hasta las 23:59:59 del 7.º día posterior, en la zona horaria configurada (por defecto `America/Montevideo`). No depende de la hora de la clase. Ejemplo: clase del lunes 2026-03-02 a las 18:00 → abierta del 02/03 00:00 al 09/03 23:59:59.
- **Roles:** Alumno, Docente y Administrador. Un usuario puede tener **varios roles** y cambia entre ellos con un selector en el menú; cada vista muestra solo lo de su rol activo.

## 2. Reglas de negocio

| # | Regla |
|---|-------|
| R1 | Un alumno puede dejar **un solo feedback por clase**. Se garantiza también en la base de datos. |
| R2 | Un alumno solo puede opinar sobre clases de materias en las que está **inscripto**. |
| R3 | Solo se puede crear o editar feedback **dentro de la ventana** de la clase. Antes de la ventana (clase futura) y después (plazo vencido) está cerrado. |
| R4 | El feedback no se puede borrar; solo editar dentro de la ventana. |
| R5 | El docente ve solo las materias en las que está asignado; cualquier otra devuelve 403/404. La autorización se basa en el usuario autenticado, nunca en un id enviado por el frontend. |
| R6 | **Anonimato:** ninguna respuesta para el docente incluye id, nombre, email ni fecha u hora de envío del autor. Los comentarios se devuelven en **orden aleatorio**. No hay umbral mínimo de respuestas. |
| R7 | El rol administrador gestiona materias, clases, docentes asignados y códigos, pero **no da acceso a feedback** (ni promedios ni comentarios). Si la misma persona también es docente, ve solo lo de sus materias, como cualquier docente. |
| R8 | La inscripción es por **código de materia**, generado automáticamente, único y visible para el admin y los docentes de la materia. Es permanente: no hay baja. |
| R9 | Las clases se crean **generándolas por calendario**: un rango de fechas y una o más reglas "día de la semana + hora" (ej. lunes 08:00, lunes 18:00, jueves 08:00). El admin puede eliminar una clase suelta solo si no tiene feedback. |
| R10 | Calificación: entero de 1 a 5. Textos: opcionales, máximo 500 caracteres; un texto vacío o solo con espacios se guarda como "sin comentario". |
| R11 | **Conflicto de interés:** un docente de una materia no puede inscribirse como alumno en esa materia, y no se puede asignar como docente a quien ya está inscripto como alumno en ella. |

## 3. Historias de usuario y criterios de aceptación

### Alumno

**HU-A1. Inscribirme a una materia con un código**
- Dado un código válido, quedo inscripto y la materia aparece en "Mis materias".
- Con un código inexistente veo "Código inválido" y no se inscribe nada.
- Si ya estoy inscripto, veo "Ya estás inscripto en esta materia" y no se duplica nada.

**HU-A2. Ver mis materias y sus clases por fecha**
- Veo solo las materias en las que estoy inscripto.
- Cada clase muestra su fecha, su hora y su estado: *Próxima* (todavía no abre), *Pendiente* (abierta, sin mi feedback), *Enviado, editable hasta DD/MM* o *Cerrada* (con o sin mi feedback).

**HU-A3. Dejar feedback sobre una clase**
- Dentro de la ventana, elijo una carita (1–5) y opcionalmente escribo qué gustó y qué no; al enviar queda guardado.
- La calificación es obligatoria; si falta, veo un error y no se guarda nada.
- Un texto de más de 500 caracteres se rechaza con un mensaje claro.

**HU-A4. Ver y editar mi feedback**
- Puedo ver el feedback que dejé en cada clase.
- Dentro de la ventana puedo modificar la nota y los textos.
- Fuera de la ventana lo veo en modo lectura.

### Docente

**HU-D1. Ver mis materias**
- Veo solo las materias en las que estoy asignado, cada una con su código de inscripción.

**HU-D2. Ver promedio por clase y tendencia del semestre**
- Para cada clase de una materia veo la fecha y la hora, la cantidad de respuestas y el promedio con un decimal.
- Veo un gráfico de línea del promedio por fecha a lo largo de la materia, y una tabla con los mismos datos.
- Las clases sin respuestas aparecen como "sin respuestas" (sin promedio) y no cortan el gráfico de forma engañosa.

**HU-D3. Ver los comentarios de una clase**
- Veo la calificación, "qué gustó" y "qué no gustó" de cada feedback, sin ningún dato del autor ni fecha u hora de envío.
- El orden es aleatorio, no cronológico.

### Administrador

**HU-ADM1. Crear una materia y asignarle docentes**
- Creo una materia con nombre y uno o más docentes; el sistema genera un código de inscripción único.
- Puedo agregar o quitar docentes de una materia.

**HU-ADM2. Generar las clases por calendario**
- Elijo un rango de fechas y una o más reglas "día de la semana + hora", y se crea una clase por cada combinación que cae en el rango.
- Si ya existe una clase de esa materia con la misma fecha y hora, no se duplica.

**HU-ADM3. Eliminar una clase suelta**
- Puedo eliminar una clase sin feedback (por ejemplo, un feriado).
- Si la clase tiene feedback, la eliminación se rechaza con un mensaje claro.

## 4. Casos borde (y respuesta esperada de la API)

| Caso | Resultado esperado |
|------|--------------------|
| Segundo feedback del mismo alumno en la misma clase | Rechazado (409 Conflict). Hay una única fila en la base. |
| Dos envíos simultáneos del mismo alumno y clase | Se guarda uno solo; la restricción única de la base rechaza el otro (409). |
| Crear feedback en una clase futura | Rechazado (403: "La clase todavía no ocurrió"). |
| Crear o editar feedback después del 7.º día | Rechazado (403: "El plazo … venció el DD/MM/AAAA"). |
| Límite exacto: día 7 a las 23:59:59 / día 8 a las 00:00 | Aceptado / rechazado. |
| Alumno no inscripto que opina sobre una clase | Rechazado (403/404). |
| Alumno inscripto tarde | Puede opinar sobre clases pasadas cuya ventana sigue abierta. |
| Calificación 0, 6, decimal, texto o ausente | Rechazado (422, validación). |
| Texto de 501 caracteres | Rechazado (422, validación). |
| Docente pide una materia o clase en la que no está asignado | 403/404, sin filtrar ningún dato. |
| Docente manipula ids en la URL o en el cuerpo | Se ignora; se filtra siempre por el usuario autenticado. |
| Respuesta al docente con comentarios | No incluye id, nombre ni email del alumno, ni fechas de creación o edición. |
| Admin intenta ver feedback o promedios | 403. |
| Alumno intenta acceder a endpoints de docente o admin | 403. |
| Request sin sesión o con sesión expirada | 401; el frontend redirige al login. |
| Código de inscripción inválido / ya inscripto | 404 "Código inválido" / 409 "Ya inscripto". |
| Eliminar una clase con feedback | Rechazado (409). |
| Generación de calendario con fin anterior al inicio, sin reglas o de más de 400 días | Rechazado (422). |
| Generación que se superpone con clases existentes | Solo se crean las combinaciones fecha + hora nuevas. |
| Dos clases el mismo día (08:00 y 18:00) | Son clases distintas: el alumno puede dejar un feedback en cada una y ambas comparten la misma ventana de 7 días. |
| Docente de la materia intenta inscribirse con el código | Rechazado (409 "Sos docente de esta materia"). |
| Admin asigna como docente a un alumno inscripto en esa materia | Rechazado (409). |
| Usuario admin + docente | Los endpoints de admin nunca devuelven feedback; por los endpoints de docente ve solo sus materias. El backend autoriza según los roles del usuario autenticado; el "rol activo" es solo una vista del frontend. |
| Usuario pide un endpoint de un rol que no tiene | 403. |
| Admin intenta quitarse su propio rol de administrador | Rechazado (409), para no quedar sin administradores. |
| Admin le quita el rol docente a alguien | Se lo desasigna de sus materias y pierde el acceso de docente. |
| Materia con varios docentes | Todos ven los mismos datos agregados. |

## 5. Fuera del MVP

- Extras (Fase 6, solo si el equipo los confirma): comparación entre materias, exportar a planilla, palabras más repetidas.
- Agregar clases sueltas, desinscripción, borrado de feedback, umbral de anonimato: descartados por ahora (ver decisiones).
