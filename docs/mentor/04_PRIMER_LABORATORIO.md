# Primer laboratorio — entender el entorno antes de construir

## Propósito
Practicar observación sistemática y aprender a demostrar con evidencia qué entorno se está usando. Este laboratorio no instala software, no edita configuración y no borra nada.

## Criterios de aceptación
Al terminar, el estudiante puede:
1. Distinguir PowerShell de Ubuntu/WSL.
2. Explicar la diferencia entre ruta actual, proceso, puerto y contenedor.
3. Registrar versiones disponibles sin instalarlas.
4. Identificar al menos un dato observado y una hipótesis que aún necesita verificación.
5. Explicar por qué no debe arreglar un error antes de reproducirlo y entenderlo.

## Paso 0 — permiso y límites
Antes de empezar, confirma que el estudiante autoriza ejecutar comandos de solo lectura. No crees archivos ni contenedores en esta fase.

## Paso 1 — identificar la terminal
En PowerShell:
```powershell
Get-Location
$PSVersionTable.PSVersion
```
En Ubuntu/WSL:
```bash
pwd
printf 'Shell: %s\n' "$SHELL"
cat /etc/os-release
```
Pregunta: ¿qué diferencias ves entre las dos salidas? ¿Cómo sabes cuál sistema está ejecutando cada comando?

## Paso 2 — comprobar herramientas existentes
En PowerShell:
```powershell
Get-Command git, wsl, docker -ErrorAction SilentlyContinue | Select-Object Name, Source
wsl --list --verbose
```
En Ubuntu/WSL:
```bash
command -v git || true
git --version
command -v java || true
java -version
command -v node || true
node --version
command -v docker || true
docker --version
```
No intentes instalar herramientas que falten. Explica que `command -v` localiza un ejecutable en el entorno actual y que `--version` consulta la versión cuando la herramienta está disponible.

## Paso 3 — recursos básicos
En Ubuntu/WSL:
```bash
nproc
free -h
df -h /
```
Pregunta: ¿qué mide cada comando? ¿Por qué la memoria que ve WSL no necesariamente describe toda la memoria de Windows de manera directa?

## Paso 4 — inspeccionar Git solo si ya estás dentro de un repositorio autorizado
```bash
git status --short --branch
git log -5 --oneline
```
Si no estás dentro de un repositorio, no inicialices uno. Explica qué evidencia aporta cada comando y qué no demuestra.

## Paso 5 — informe de laboratorio
El estudiante debe escribir, en el chat o en un documento que haya autorizado crear:
- Entorno y terminales detectadas.
- Herramientas encontradas y ausentes.
- Salidas importantes resumidas sin secretos.
- Dos observaciones confirmadas.
- Dos hipótesis pendientes.
- Un problema que le gustaría investigar en el próximo laboratorio.

## Extensión opcional — solo tras aprobación
Crear una carpeta de práctica nueva y aislada en `~/lab-ingenieria/semana-01`, verificar su ruta y crear un `README.md` con el propósito del laboratorio. Antes de hacerlo, confirmar que la ruta no existe o que no contiene datos del usuario; presentar el plan y pedir aprobación.
