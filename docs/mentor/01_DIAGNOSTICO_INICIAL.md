# Procedimiento de diagnóstico inicial — solo lectura

## Objetivo
Conocer el entorno real y la forma de razonar del estudiante antes de recomendar instalaciones, cambiar configuraciones o iniciar laboratorios.

## Límites
- Ejecutar desde la terminal adecuada y explicar cada comando.
- No usar `sudo`, no instalar/actualizar nada, no modificar archivos, no iniciar/parar servicios ni contenedores.
- No imprimir archivos `.env`, historiales completos, llaves, tokens ni configuraciones que puedan contener secretos.
- Si un comando no existe, registrar `no disponible`; no instalarlo para continuar.
- Antes de ejecutar comandos que enumeran procesos o variables, revisar si la salida podría contener datos sensibles y resumir en vez de volcarlo todo.

## Fase A — preguntas antes de ejecutar
1. ¿Cuál es el directorio de trabajo previsto y qué proyecto se quiere usar primero?
2. ¿WSL2 y Docker Desktop están instalados y funcionando actualmente?
3. ¿Qué terminal se está usando ahora: PowerShell, Ubuntu/WSL o terminal integrada de Claude Code?
4. ¿Hay cambios locales que no se deban tocar? ¿Qué carpetas son intocables?
5. ¿Qué tres áreas domina y cuáles le cuestan más? Pide un ejemplo concreto por cada una.

## Fase B — inventario de solo lectura
Ejecuta los comandos de uno en uno. Explica el propósito antes de cada bloque y permite que el estudiante prediga el resultado.

### En PowerShell (Windows)
```powershell
Get-Location
$PSVersionTable.PSVersion
Get-Command git, wsl, docker, code -ErrorAction SilentlyContinue | Select-Object Name, Source
wsl --status
wsl --list --verbose
docker version
```
Notas:
- `docker version` puede fallar si Docker Desktop no está abierto; registra el error sin intentar arreglarlo automáticamente.
- No ejecutes `docker info` sin revisar si la salida puede exponer detalles del entorno.

### En Ubuntu/WSL
```bash
pwd
uname -a
cat /etc/os-release
printf 'Shell: %s\n' "$SHELL"
command -v git || true
git --version
command -v java || true
java -version
command -v mvn || true
mvn -version
command -v node || true
node --version
command -v npm || true
npm --version
command -v docker || true
docker --version
```
Si una herramienta no está instalada, anótalo; no la instales.

### Recursos básicos en WSL
```bash
nproc
free -h
df -h /
```
No infieras la memoria total de Windows únicamente desde una salida parcial de WSL.

### En un repositorio existente (solo si el usuario indica el directorio)
```bash
git status --short --branch
git rev-parse --show-toplevel
git log -5 --oneline
```
No hagas `git pull`, checkout, reset, clean, commit ni stash durante el diagnóstico. Si no es un repositorio Git, dilo.

## Fase C — mapa de conocimientos
Pide respuestas sin consultar Internet ni IA adicional. No penalices no recordar sintaxis; evalúa el razonamiento.
1. Explica qué pasa desde que escribes una URL hasta que aparece una página web.
2. Diferencia proceso, hilo, memoria RAM y almacenamiento.
3. ¿Qué hace DNS? ¿Qué diferencia hay entre TCP y HTTP?
4. Explica una clave primaria, una clave foránea y una transacción.
5. ¿Qué problema resuelve Git? ¿Qué diferencia hay entre `commit`, `push` y `merge`?
6. ¿Qué diferencia hay entre una imagen y un contenedor Docker?
7. ¿Cómo diagnosticarías una API que devuelve HTTP 500?
8. ¿Cómo comprobarías que una consulta SQL no duplica registros?
9. ¿Qué es una prueba unitaria y qué no garantiza?
10. ¿Cómo comprobarías que una variable de entorno no contiene un secreto expuesto en el repositorio?
11. Describe un error técnico reciente: observación, hipótesis, experimento, resultado y conclusión.
12. ¿Qué entiendes por un agente de IA que utiliza herramientas? ¿Qué riesgos introduce?

## Fase D — mini-retos de razonamiento
No ejecutar cambios todavía. Pide al estudiante que describa los pasos y el comando que elegiría.
- Reto 1: localizar un archivo por nombre sin recorrer innecesariamente todo el disco.
- Reto 2: averiguar qué proceso escucha en un puerto local.
- Reto 3: encontrar en un log las últimas líneas que contengan `ERROR`.
- Reto 4: explicar cómo probar una API local sin modificar datos.
- Reto 5: explicar cómo confirmar que un cambio de código no rompió pruebas existentes.

## Informe final obligatorio
Entrega:
- **Observado:** sistema, versiones y comandos que sí devolvieron salida.
- **No disponible / fallido:** comandos que no funcionaron y su salida resumida.
- **Evaluación provisional:** fortalezas y brechas por dominio, sin afirmar dominio sin evidencia.
- **Riesgos y restricciones:** datos sensibles, proyectos protegidos, límites del entorno.
- **Plan propuesto:** primera semana adaptada a los resultados.
- **Acciones pendientes de aprobación:** instalaciones, archivos a crear, contenedores a iniciar o configuración a cambiar.

Termina preguntando si el estudiante autoriza iniciar el primer laboratorio. No continúes con cambios hasta recibir autorización.
