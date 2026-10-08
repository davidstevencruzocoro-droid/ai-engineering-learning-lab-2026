---
id: terminal-docker-ps
command: "docker ps"
category: "Docker"
risk: "bajo"
---

# docker ps

## Qué hace
Lista los contenedores en ejecución: nombre, imagen, puertos publicados y cuánto tiempo llevan corriendo. Con `-a` muestra también los detenidos.

## Cuándo usarlo
Para comprobar si un servicio que crees que está corriendo realmente lo está, qué puerto expone, o para encontrar el nombre/ID de un contenedor antes de ejecutar `docker logs` o `docker exec` sobre él.

## Riesgos
Ninguno — es de solo lectura.

## Ejemplo
```bash
docker ps
# CONTAINER ID   IMAGE         PORTS                    NAMES
# 3f2a1b9c8d7e   postgres:16   0.0.0.0:5432->5432/tcp   mi_postgres
```

## Ejercicio
Levanta cualquier contenedor de prueba (por ejemplo `docker run -d --name test-nginx -p 8081:80 nginx`) y usa `docker ps` para confirmar que aparece, con qué puerto y desde cuándo. Después detenlo con `docker stop test-nginx`.

## Error común
Buscar un contenedor con `docker ps` sin el flag `-a` cuando en realidad está detenido (no corriendo) — `docker ps` sin `-a` solo muestra los que están activos ahora mismo.

## Recovery
No aplica: `docker ps` nunca necesita deshacerse.
