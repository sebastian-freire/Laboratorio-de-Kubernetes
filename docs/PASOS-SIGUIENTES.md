# Pasos siguientes: del desarrollo al despliegue

**Fecha:** 2026-10-20 · **Estado de partida:** etapa de desarrollo cerrada (ver [`PROGRESO.md`](PROGRESO.md)).

La app ya funciona en local. Lo que resta es publicarla en el cluster del laboratorio con una pipeline de Jenkins. Los pasos están en orden: cada bloque necesita el anterior. Las decisiones marcadas con 🗳️ se votan en el equipo antes de implementarlas (como en las fases anteriores).

---

## 0. Probar la app en local (ya se puede)

| Dónde | Cómo |
|-------|------|
| En la PC | Seguir el [`README.md`](../README.md) y abrir <http://localhost:5173>. API y Swagger en <http://localhost:8000/docs>. |
| En el celular (misma red Wi‑Fi) | Ver la sección "Probar desde el celular" del README. |

Usuarios de prueba: tabla del README (contraseña `demo1234`). Para recorrer todo:

1. **Alumna** `lucia.gomez@example.com`: entrar a una materia, opinar en una clase de "Para opinar" y editar la opinión.
2. **Alumno sin materias** `tomas.alvarez@example.com`: inscribirse con el código `BASES226`.
3. **Docente** `laura.martinez@example.com`: ver Bases de Datos (promedio, gráfico, palabras, comentarios anónimos), descargar el CSV y cambiar al rol Admin.
4. **Docente con dos materias** `diego.fernandez@example.com`: "Comparar mis materias".
5. **Admin** `admin@example.com`: crear una materia, asignar docentes, generar clases por calendario y crear un usuario docente.

---

## 1. Preparar el equipo (antes de tocar el cluster)

1. **Crear el repositorio remoto** (GitHub, GitLab o el servidor del laboratorio) y subir `main`. Lo hace un integrante con permisos; Jenkins también lo va a necesitar.
2. **Clonar fuera de OneDrive.** Cada integrante trabaja en una carpeta local (por ejemplo `C:\dev\feedback-clases`). OneDrive interfiere con Git y con `node_modules`.
3. **Activar el flujo de ramas + Pull Request** (D-002): proteger `main` en el remoto y exigir una revisión por PR.
4. **Repartir el trabajo** de los bloques 2 a 6 entre los cinco (el equipo eligió organizarse solo, D-004).
5. 🗳️ **Revisar las decisiones que tomó el asistente** (marcadas "Asistente (D-030)" en `DECISIONES.md`) y los riesgos aceptados: sin umbral mínimo de respuestas (D-019) y anonimato tipo A (D-018).

## 2. Reunir los datos del laboratorio

El `team3.kubeconfig` ya da acceso al cluster (`kubernetes-main-node.reto-ucu.net`, namespace `alumno-team3`). Falta conseguir:

| Dato | A quién pedirlo | Para qué |
|------|-----------------|----------|
| URL y credenciales del **registry** de imágenes | Docente o laboratorio | Subir las imágenes que construye Jenkins |
| **Dominio o URL pública** del equipo y cómo se maneja **TLS** | Docente o laboratorio | El Ingress y `CORS_ORIGINS` |
| **IngressClass** disponible | Consulta de lectura al cluster | El manifiesto del Ingress |
| **StorageClass** disponible, o si hay una base provista | Consulta de lectura al cluster o laboratorio | Dónde vive PostgreSQL |
| **Permisos** del usuario `team3` en el namespace | Consulta de lectura (`kubectl auth can-i --list`) | Saber si podemos crear Deployments, Ingress, PVC, Jobs y Secrets |
| URL de **Jenkins**, credenciales y cómo llega al cluster | Docente o laboratorio | La pipeline |

> El kubeconfig contiene el token del equipo: no se comparte por chat ni se sube al repo (ya está en `.gitignore`).

## 3. Contenedores

1. 🗳️ **Cómo se sirve el frontend y cómo llega a la API.** Recomendado: mismo dominio, con el Ingress mandando `/api` al backend, y la imagen del frontend construida con `VITE_API_URL` vacío (así no hay CORS ni URLs distintas por entorno).
2. **`backend/Dockerfile`**: Python 3.13 + uv, dependencias desde `uv.lock`, usuario no root, `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
3. **`frontend/Dockerfile`** en dos etapas: `npm ci && npm run build` y luego servir `dist/` con nginx, con fallback a `index.html` para las rutas de la SPA.
4. **`.dockerignore`** en ambos (`node_modules`, `.venv`, `.env`, `dist`, tests).
5. **Endpoint de liveness** que no dependa de la base (por ejemplo `GET /api/live`). `/api/health` queda para readiness. Con su prueba.
6. **Verificar en local:** `docker build` de ambas imágenes, correrlas contra la base de Docker Compose y repetir el recorrido del paso 0.

## 4. Manifiestos de Kubernetes (namespace `alumno-team3`)

1. 🗳️ **Formato:** YAML planos en `k8s/` (recomendado por simplicidad), Kustomize o Helm.
2. 🗳️ **Base de datos:** StatefulSet de PostgreSQL con PVC (si hay StorageClass) o la base que provea el laboratorio.
3. **Secret** `feedback-secrets`: `JWT_SECRET`, contraseña de la base, `DATABASE_URL`. Se crea a mano o desde Jenkins, **nunca en el repo**.
4. **ConfigMap** `feedback-config`: `CORS_ORIGINS` (URL pública), `APP_TIMEZONE=America/Montevideo`, `FEEDBACK_WINDOW_DAYS=7`.
5. **Job de migraciones** (`alembic upgrade head`) que corre antes de cada versión del backend.
6. **Deployment y Service del backend**, con probes de readiness (`/api/health`) y liveness (`/api/live`), requests/limits y 2 réplicas.
7. **Deployment y Service del frontend.**
8. **Ingress**: `/` al frontend, `/api` al backend, con el host y el TLS del paso 2.
9. **Primer despliegue a mano** con `kubectl apply`, cargar el seed una vez para la demo (Job o `kubectl exec`) y probar desde el celular con la URL pública.

## 5. Pipeline de Jenkins

1. **`Jenkinsfile`** en la raíz con estas etapas:
   1. *Checkout.*
   2. *Backend:* `uv sync`, `ruff check` y `pytest`, con un PostgreSQL efímero (contenedor de servicio) y `TEST_DATABASE_URL`.
   3. *Frontend:* `npm ci`, `npm run lint` y `npm run build`.
   4. *Imágenes:* `docker build` de ambas, etiquetadas con el hash del commit, y push al registry.
   5. *Despliegue* (solo desde `main`): Job de migraciones y `kubectl set image` o `kubectl apply`, esperando `rollout status`.
2. **Credenciales en Jenkins**: registry, kubeconfig del equipo y secretos de la app (nunca en el `Jenkinsfile`).
3. **Disparador**: webhook del repo remoto (o polling si el laboratorio no permite webhooks).
4. **Probar la pipeline**: un PR que rompa una prueba debe fallar; un merge a `main` debe desplegar.

## 6. Cierre de la etapa de despliegue

1. Completar la sección **"Despliegue"** de [`ARQUITECTURA.md`](ARQUITECTURA.md) con el diagrama del cluster (Ingress, Services, Deployments, base).
2. Actualizar el **README** con la URL pública y cómo desplegar.
3. Agregar a `DECISIONES.md` y `PROGRESO.md` lo decidido en esta etapa.
4. **Checklist final**: la app abre desde el celular con la URL pública, los datos persisten tras reiniciar los pods, la pipeline corre las pruebas, construye las imágenes y despliega.

## Mejoras opcionales (si sobra tiempo)

- Límite de intentos de login (en el Ingress o en el backend).
- Umbral mínimo de respuestas para mostrar comentarios (hoy no existe, por D-019).
- Código de asistencia por clase (hoy alcanza con estar inscripto, por D-007).
