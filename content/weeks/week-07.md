---
id: 7
level: 3
xp: 25
title: "Semana 7 · Docker"
---

# Semana 7: Docker y entornos reproducibles

## Objetivo
Aprender a encapsular aplicaciones para que puedan ejecutarse igual en cualquier entorno.

## Por qué importa
Cuando un sistema se ejecuta en una máquina y falla en otra, la reproducibilidad se vuelve un requisito crítico.

## Conceptos
- Dockerfile
- imagen
- contenedor
- volúmenes
- redes
- Compose

## Arquitectura
```text
Código fuente
  ↓
Dockerfile
  ↓
Imagen
  ↓
Contenedor
  ↓
Entorno reproducible
```

## Ejemplo
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
```

## Profundización técnica
El ejemplo anterior construye una imagen funcional, pero no es como se hace en producción: copia `node_modules` dentro de la imagen final, no tiene healthcheck, y corre como root por defecto. Una versión con más criterio usa un build multi-stage:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/node_modules ./node_modules
USER app
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

La primera etapa (`build`) tiene las herramientas de compilación; la segunda copia solo el resultado (`dist/` y dependencias de producción), dejando fuera compiladores y archivos fuente que no hacen falta en runtime — la imagen final es más pequeña y tiene menos superficie de ataque. `USER app` evita correr como root dentro del contenedor (si alguien lograra ejecutar código arbitrario adentro, no tendría privilegios de root del contenedor). El `HEALTHCHECK` le dice a Docker (y a Compose, y a orquestadores como Kubernetes) cómo saber si el proceso "está corriendo" pero en realidad dejó de responder — sin esto, un proceso colgado sigue contando como "Up" indefinidamente.

En Compose, el healthcheck habilita algo clave: que un servicio espere a que otro esté *realmente listo*, no solo "iniciado":
```yaml
services:
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5
```
Sin `condition: service_healthy`, `depends_on` solo garantiza orden de arranque, no que `db` ya acepte conexiones — una causa clásica de "funciona si reinicio, falla en el primer arranque".

## Laboratorio
Containerizar frontend, backend y base de datos para que puedan arrancar juntos con un único flujo.

## Preparación
- Docker instalado
- proyecto base funcionando
- conocimiento de puertos y redes

## Paso 1
Definir la imagen del servicio principal.

## Paso 2
Configurar variables y dependencias para que arranquen juntos.

## Paso 3
Verificar que el entorno funciona sin depender del host local.

## Verificación
```bash
docker build -t lab-app .
docker compose up
```

## Errores comunes
- puertos duplicados,
- dependencias sin definir,
- rutas relativas mal configuradas,
- contenedores sin healthcheck.

## Debugging
Revisa logs de contenedor, puertos y variables locales antes de poner la culpa en el código.

## Reto
Diagnosticar un contenedor que no arranca por un problema de red o configuración.

## BREAK THE SYSTEM
Romper la configuración de entorno para descubrir qué parte del sistema está fallando.

## RECOVERY
Corregir la composición del entorno y documentar la causa raíz.

## Evaluación
- ¿El servicio arranca reproduciendo el mismo entorno?
- ¿La configuración es portable?
- ¿Se documenta la ejecución?

## Evidencia
Guardar Dockerfiles, Compose, logs y decisiones de configuración.

## Criterio de aprobación
El estudiante debe poder describir por qué Docker reduce la fricción entre entornos.
