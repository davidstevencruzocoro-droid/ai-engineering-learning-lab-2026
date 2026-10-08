# Inventario del entorno local

La sección **Consola y mentor → Ver inventario detectado en este equipo** consulta el entorno al abrir la aplicación local y permite actualizarlo. La API solo escucha en `127.0.0.1`; usa una lista fija de comprobaciones de solo lectura. No ejecuta comandos recibidos desde el navegador, no escanea otros equipos y no comparte el inventario con Ollama.

El sondeo de proyectos se limita al workspace desde el que se inicia `npm run lab:server` y sus carpetas inmediatas. El listado de puertos describe sockets TCP en escucha del equipo; algunos son servicios del sistema. Los nombres de extensiones, contenedores, proyectos y procesos son datos locales: revísalos o redáctalos antes de publicar este documento.

## Snapshot verificado

Capturado el **8 de octubre de 2026** desde `C:\Users\ADMIN\Documents\Lab`. Las versiones y servicios pueden cambiar; el panel de la aplicación consulta el estado actual.

### Sistema, terminal y herramientas

| Componente | Detección |
|---|---|
| Sistema | Windows 11 Pro, versión `10.0.26300`, x64 |
| Terminal | PowerShell `5.1.26100.9549` |
| WSL | `Ubuntu-24.04`, `docker-desktop`, `kali-linux` |
| Docker | Docker Desktop `29.8.0`; daemon disponible y sandbox `ai-lab-sandbox:local` construido |
| Git | `2.55.0.windows.3` |
| Node.js | `v24.18.0` |
| Java | OpenJDK `21.0.11` LTS |
| Python | No confirmado: `python`/`python3` apuntan al alias de Microsoft Store, no a un intérprete verificable |
| Maven / Gradle | No se detectó un comando global en `PATH`; hay extensiones de VS Code para ambos |
| PostgreSQL CLI / MySQL CLI | No se detectaron `psql` ni `mysql` globales |
| PostgreSQL / MySQL | Servicios y contenedores locales activos; ver los puertos y contenedores listados abajo |
| Ollama | `0.40.0`, disponible en `127.0.0.1:11434`; modelo `llama3.2:latest` disponible |
| n8n | No se detectó un comando global en `PATH` |
| VS Code | `1.141.0`; CLI `code` disponible |
| GitHub CLI | `2.97.0`; solo se verificó la instalación, no el estado de autenticación |

### Extensiones de VS Code

La lista se obtuvo con `code --list-extensions`. Tener una extensión de integración no confirma que el CLI o runtime correspondiente esté instalado.

- Java: `andreh.jdk-setter`, `redhat.java`, `vscjava.vscode-java-debug`, `vscjava.vscode-java-dependency`, `vscjava.vscode-java-pack`, `vscjava.vscode-java-test`.
- Python: `ms-python.debugpy`, `ms-python.python`, `ms-python.vscode-pylance`, `ms-python.vscode-python-envs`.
- Docker/infraestructura: `ms-azuretools.vscode-containers`, `vscjava.vscode-gradle`, `vscjava.vscode-maven`.
- IA y colaboración: `anthropic.claude-code`, `ms-vsliveshare.vsliveshare`, `openai.chatgpt`, `openai.codex-audio`.
- Otras: `mechatroner.rainbow-csv`, `ms-vscode.powershell`, `pkief.material-icon-theme`, `rangav.vscode-thunder-client`, `tomoki1207.pdf`, `usernamehw.errorlens`.

### Contenedores activos observados

`docker ps` mostró en el último sondeo:

| Contenedor | Imagen | Puertos publicados/visibles |
|---|---|---|
| `dcbeautypro_frontend` | `dcbeautypro-frontend:latest` | `80/tcp` |
| `dcbeautypro_backend` | `dcbeautypro-backend:latest` | `8080/tcp` |
| `dcbeautypro_nginx` | `dcbeautypro-nginx` | Host `443` y `5173` → contenedor `80` |
| `dcbeautypro_backup` | `dcbeautypro-backup` | `3306/tcp`, `33060/tcp` |
| `dcbeautypro_vigilancia` | `dcbeautypro-vigilancia` | Sin puerto publicado |
| `dcbeautypro_certbot` | `certbot/certbot:v5.8.0` | `80/tcp`, `443/tcp` |
| `dcbeautypro_db` | `114b183a1f18` | `3306/tcp`, `33060/tcp` |
| `flota_control_redis_dev` | `redis:7-alpine` | Host `6380` → contenedor `6379` |
| `flota_control_postgres_dev` | `postgis/postgis:16-3.4-alpine` | Host `5434` → contenedor `5432` |

Los contenedores efímeros del runner solo aparecen durante una ejecución; se eliminan al finalizar.

### Puertos TCP relevantes observados

| Puerto | Proceso/destino detectado | Uso observado |
|---:|---|---|
| `4173` | `node` | Vite, aplicación local |
| `4176` | `node` | API local del runner y mentor |
| `443` | Docker Desktop / `wslrelay` | Servicio publicado por Docker |
| `3360`, `33060` | `mysqld` | Servicio MySQL local |
| `5173` | Docker Desktop / `wslrelay` | Servicio publicado por Docker |
| `5432` | `postgres` | PostgreSQL local |
| `5434` | Docker Desktop / `wslrelay` | PostgreSQL del contenedor, publicado en host |
| `6380` | Docker Desktop / `wslrelay` | Redis del contenedor, publicado en host |
| `11434` | `ollama` | API local de Ollama |

Este inventario no detiene, modifica ni prueba conexiones contra bases de datos existentes.

### Workspace inspeccionado

La exploración se limitó al workspace actual y a una carpeta de profundidad:

- `.` — proyecto Node.js **Lab**.
- `app` — código de la aplicación (Node.js).
- `sandbox` — imagen y lanzador Docker del runner.

No se recorrieron otros directorios de `Documents`, el perfil del usuario ni discos adicionales. La detección de proyectos no lee ni indexa sus archivos fuente.

## Qué se habilita con este entorno

- Docker y el sandbox están disponibles para los cuatro perfiles aislados existentes: JavaScript, Python, Java y SQLite. El perfil Python corre dentro del contenedor aunque el Python del host no esté confirmado.
- JavaScript y Java están presentes en el host; Node.js y Java se detectaron con versión.
- Ollama y `llama3.2:latest` permiten mentoría local.
- PostgreSQL y MySQL están escuchando localmente, pero el Lab **todavía no** conecta ni administra esas bases de datos. No ejecutes comandos de escritura contra ellas desde una práctica.
- Python del host, Maven/Gradle CLI y n8n no se pueden dar por disponibles. Antes de proponer laboratorios que dependan de ellos, hay que instalarlos o usar una alternativa aislada verificada.

La lista actual de laboratorios es contenido estático: el inventario ya se muestra en la aplicación, pero todavía no genera automáticamente prácticas nuevas ni cambia los comandos del currículum. Esa adaptación pertenece a la siguiente fase.
