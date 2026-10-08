---
id: terminal-docker-compose-up
command: "docker compose up"
category: "Docker"
risk: "medio"
---

# docker compose up

## Qué hace
Lee `docker-compose.yml` en el directorio actual y levanta todos los servicios definidos (aplicación, base de datos, etc.), creando las redes y volúmenes que falten. Con `-d` corre en segundo plano (detached).

## Cuándo usarlo
Para levantar un entorno multi-servicio completo (por ejemplo backend + Postgres) con un solo comando, en vez de arrancar cada contenedor a mano con `docker run`.

## Riesgos
Medio. Si el `docker-compose.yml` tiene un volumen mal configurado puede sobrescribir datos de un volumen existente, y si un puerto ya está ocupado por otro proceso, el servicio simplemente no arrancará (error silencioso si no revisas los logs).

## Ejemplo
```bash
docker compose up -d
# [+] Running 3/3
#  ✔ Network mi-proyecto_default   Created
#  ✔ Container mi-proyecto-db-1    Started
#  ✔ Container mi-proyecto-api-1   Started

docker compose ps     # ver qué quedó corriendo
docker compose logs -f api   # seguir los logs de un servicio específico
```

## Ejercicio
Levanta el `docker-compose.yml` de alguno de tus proyectos de laboratorio (semana 7). Para un servicio deliberadamente: edita el YAML y pon un puerto que ya esté ocupado, ejecuta `docker compose up`, y diagnostica el error en los logs sin buscar la solución en internet primero.

## Error común
No mirar los logs cuando un servicio "no responde" — casi siempre el motivo (puerto ocupado, variable de entorno faltante, error de conexión a la base de datos) está explícito en `docker compose logs`.

## Recovery
`docker compose down` detiene y elimina los contenedores y la red (no los volúmenes, salvo que añadas `-v`, lo cual SÍ borra los datos). Si rompiste algo, `docker compose down && docker compose up -d` suele recrear el entorno desde cero.
