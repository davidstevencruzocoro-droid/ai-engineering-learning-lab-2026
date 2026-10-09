# Catálogo de comandos seguros para aprender

## Reglas generales
- Ejecuta un comando a la vez y revisa su salida.
- Confirma siempre en qué terminal estás: PowerShell, Ubuntu/WSL o terminal de un contenedor.
- Los comandos de ejemplo usan rutas de muestra; sustitúyelas solo después de confirmar la ruta real.
- Un comando de lectura puede revelar datos sensibles. No compartas salidas con secretos.
- Antes de modificar archivos, usa `git status` y revisa si hay trabajo sin guardar.

## PowerShell — inspección
```powershell
Get-Location
Get-ChildItem -Force
Get-Command git, wsl, docker -ErrorAction SilentlyContinue
Get-Process | Select-Object -First 15 ProcessName, Id
Get-Service | Select-Object -First 15 Name, Status
Get-NetTCPConnection -State Listen | Select-Object -First 20 LocalAddress, LocalPort, OwningProcess
```
Explica que la enumeración de procesos/puertos puede mostrar nombres internos; comparte solo lo necesario.

## Ubuntu/WSL — navegación y archivos
```bash
pwd
ls -la
cd -- /ruta/confirmada
mkdir -p ~/lab-ingenieria/semana-01
file nombre-del-archivo
head -n 20 README.md
tail -n 30 archivo.log
grep -n "ERROR" archivo.log
find . -maxdepth 3 -type f -name 'application.yml' -print
```
`mkdir` modifica el sistema; úsalo solo dentro de una carpeta de laboratorio autorizada. `cd` cambia la sesión, no el contenido del disco.

## Recursos y procesos — inspección
```bash
uname -a
cat /etc/os-release
nproc
free -h
df -h /
du -sh .
ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head
ss -lnt
```
No uses `kill` para aprender sin identificar primero el proceso y entender el impacto. Evita `ss -p` si la salida pudiera revelar información sensible que no deba compartirse.

## Git — lectura antes de escribir
```bash
git status --short --branch
git log -5 --oneline
git diff --stat
git diff
git diff --staged
git branch --show-current
git remote -v
```
`git remote -v` puede mostrar URLs privadas. Revisa y redacta antes de compartir. No uses comandos de limpieza o reversión destructiva como solución automática.

## Red y HTTP — pruebas locales
```bash
getent hosts example.com
curl --head --max-time 5 https://example.com
ss -lnt
```
Una petición HTTP puede contactar un servicio externo. Usa destinos autorizados y no incluyas credenciales en la línea de comandos. Para APIs locales, empieza con endpoints de lectura y datos sintéticos.

## Docker — inspección sin borrar
```bash
docker version
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
docker images
```
No ejecutes `docker system prune`, `docker volume prune`, `docker rm`, `docker compose down -v` ni borrado de volúmenes sin evaluar los datos afectados y recibir autorización explícita.

## Comandos de riesgo que requieren parada y autorización
`sudo`, `rm -rf`, `rmdir /s`, `del /s`, `format`, `diskpart`, `chmod -R`, `chown -R`, `git reset --hard`, `git clean -fd`, `git push --force`, `docker system prune`, `docker volume rm`, `docker compose down -v`, cambios de firewall, despliegues y migraciones destructivas.

## Ejercicio
Para cada comando, el estudiante debe explicar: qué lee o modifica, privilegios requeridos, posible efecto secundario, salida esperada y cómo verificarlo sin repetir una acción riesgosa.
