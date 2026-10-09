# Operations — Cómo se opera lo que construyes en este laboratorio

Este documento cubre las prácticas operativas transversales a las semanas 7-9, 18, 19 y 20 (Docker, CI/CD, Linux/Cloud, LLMOps, sistemas distribuidos, performance).

## Despliegue de este dashboard

El sitio es estático y se publica con GitHub Pages mediante `.github/workflows/deploy-pages.yml`. El workflow ejecuta validación de contenido, pruebas unitarias y E2E antes de compilar y publicar el artefacto `dist/`. Vite recibe la ruta base derivada del nombre del repositorio, por lo que funcionan tanto páginas de proyecto (`/<repositorio>/`) como el sitio de usuario (`/`).

Configuración inicial:

1. En GitHub, abre **Settings → Pages** y establece **Build and deployment → Source** en **GitHub Actions**.
2. Confirma que el repositorio use `main` como rama de publicación (o ajusta el trigger del workflow si la rama principal tiene otro nombre).
3. Haz push a `main` o ejecuta el workflow manualmente desde **Actions → Deploy AI Engineering Learning Lab to GitHub Pages → Run workflow**.
4. Revisa que el job de build pase validación, unit tests, Playwright y compilación; después confirma que el job `deploy` terminó y usa el enlace de Pages publicado en el entorno `github-pages`.
5. Prueba la URL pública en escritorio y móvil, abre una guía, revela una pista y recarga para comprobar persistencia. El progreso continúa limitado al navegador/dispositivo del usuario.

En un checkout local, se puede simular una página de proyecto en PowerShell estableciendo `$env:VITE_BASE_PATH = "/Lab/"` antes de `npm run build`. Vite normaliza la ruta; en los builds locales habituales se usa `/`.

## Consola y mentor locales

La ejecución de código y Ollama no forman parte del sitio público de Pages. Para usarlos en el equipo de desarrollo:

1. Instala e inicia Docker Desktop. Construye la imagen limitada con `npm run lab:sandbox:build`.
2. En una terminal ejecuta `npm run lab:server`; el servicio solo escucha en `127.0.0.1:4176`.
3. En otra terminal ejecuta `npm run dev` y abre la URL local que muestra Vite. Las solicitudes `/api` se envían por proxy al servicio loopback.
4. Instala/inicia Ollama y descarga `ollama pull llama3.2:latest`. La consola puede funcionar aunque Ollama no esté listo; el mentor requiere el modelo.
5. Usa “Comprobar servicios locales” si iniciaste Docker, Ollama o el servidor después de abrir la página.

Cada ejecución acepta código de un perfil permitido y crea un contenedor nuevo sin red ni acceso a archivos del host. No proporciona un shell general ni conserva archivos entre ejecuciones. El mentor corre localmente y el código/salida solo se comparte al marcar la casilla de consentimiento. Para instrucciones de riesgo y límites, consulta `docs/SECURITY.md`. El sandbox no es una plataforma multiusuario ni un servicio para exponer a Internet.

Al abrir la consola se consulta también `GET /api/environment`. El sondeo usa herramientas de una lista fija y operaciones de lectura; tiene timeout y límite de salida por proceso. Solo enumera proyectos del workspace actual y sus carpetas inmediatas, no recorre el perfil del usuario ni lee contenido de código. La UI muestra puertos, procesos, extensiones y nombres de contenedores localmente; esos datos no se envían al mentor automáticamente. Consulta [ENVIRONMENT.md](ENVIRONMENT.md) para el snapshot y para distinguir un CLI ausente de una integración disponible en un contenedor.

La sección “Terminal Coach · Terminal Tutor” obtiene su catálogo fijo desde `GET /api/terminal/commands`. Para ejecutar una práctica escribe primero una predicción; luego el navegador envía solo el identificador del catálogo a `POST /api/terminal/run`. Los diagnósticos disponibles son comandos acotados de lectura (versiones, lista de contenedores, distribuciones WSL y modelos Ollama), con límite de 8 segundos y salida de 8 KB. Si una herramienta no está instalada, la API lo informa sin ejecutarla. La UI compara la predicción con la salida y muestra criterio de verificación, errores comunes y recovery. No se acepta texto de comando ni se modifican archivos, contenedores, bases de datos o servicios.

## 1. Principio general

Un sistema "funciona en mi máquina" no está operado — está encendido por accidente. Operar significa que el sistema sigue funcionando, es diagnosticable y es recuperable cuando tú no estás mirando.

## 2. Checklist mínimo de producción (aplica a cualquier lab desplegado, especialmente semanas 9 y 24)

- [ ] El servicio se reinicia solo tras un fallo o un reinicio del servidor (systemd `Restart=on-failure`, o `restart: unless-stopped` en Docker Compose)
- [ ] Las variables de configuración (puertos, claves, URLs) están fuera del código, en variables de entorno
- [ ] Existen logs accesibles sin tener que adivinar dónde están
- [ ] Hay un healthcheck o endpoint que permite comprobar en 1 petición si el servicio está sano
- [ ] HTTPS activo con certificado válido (no autofirmado en producción)
- [ ] Existe un procedimiento documentado de rollback si un despliegue sale mal

## 3. Patrones de resiliencia enseñados en este laboratorio

| Patrón | Qué resuelve | Semana |
|---|---|---|
| Timeout | Evita que una llamada colgada bloquee todo el sistema | 11, 13 |
| Retry con backoff | Recupera de fallos transitorios sin saturar al que falla | 11 |
| Circuit breaker | Evita seguir llamando a una dependencia ya caída | 19 |
| Idempotencia | Permite reintentar una operación sin duplicar su efecto | 11, 19 |
| Healthcheck | Permite detectar automáticamente un servicio no sano | 7, 9 |

## 4. Observabilidad mínima (ver `docs/AI-EVALUATION.md` para la parte específica de IA)

Para cualquier servicio operado en este laboratorio, debes poder responder sin adivinar:

1. ¿Está funcionando ahora mismo? (healthcheck)
2. ¿Cuánto tarda en responder? (latencia)
3. ¿Cuántas peticiones están fallando? (tasa de error)
4. ¿Por qué falló esta petición específica? (logs con contexto suficiente para reproducir el problema)

## 5. Gestión de incidentes (práctica para el modo "Break the System")

Cuando algo se rompe deliberadamente (o de verdad) en un laboratorio:

1. **Detectar:** ¿cómo supiste que algo estaba mal? (alerta, log, usuario reportando)
2. **Contener:** ¿puedes limitar el daño mientras investigas? (circuit breaker, rollback, modo degradado)
3. **Diagnosticar:** ¿cuál es la causa raíz, no solo el síntoma?
4. **Corregir:** aplica el fix mínimo necesario, no un rediseño completo a mitad de incidente.
5. **Documentar:** usa la plantilla de `docs/POSTMORTEM.md`.

## 6. Infraestructura como código

A partir de la semana 7 (Docker) y 8 (CI/CD), toda la infraestructura de tus laboratorios debe poder reconstruirse ejecutando comandos versionados (`Dockerfile`, `docker-compose.yml`, workflows de CI), no mediante pasos manuales que solo tú recuerdas. Si no puedes borrar tu entorno y reconstruirlo desde el repositorio, no está realmente versionado.
