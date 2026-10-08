---
id: lab-07
week: 7
xp: 35
title: "Docker y entorno reproducible"
---

# Lab 07: Dockerizar aplicaciones

## Objetivo
Crear un entorno reproducible y portátil para ejecutar la aplicación con sus dependencias.

## Duración
2 sesiones

## Requisitos
- Docker instalado
- proyecto con dependencias mínimas
- entorno local configurable

## Tareas
1. Crear un Dockerfile para la aplicación.
2. Definir dependencias y variables esenciales.
3. Ejecutar el contenedor en local.
4. Verificar que la aplicación responde como esperabas.

## Pista
Empieza por un servicio simple y valida el pipeline de arranque antes de amplificar el entorno.

## Pista 2
Instala dependencias en una capa reproducible, copia solo los archivos necesarios y pasa configuración por variables de entorno, no como valores incrustados en la imagen.

## Pista 3
Construye y ejecuta la imagen desde cero con el puerto publicado. Revisa logs y código de salida, detén/reinicia el contenedor y confirma que el servicio sigue respondiendo.

## Solución
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
```

## Penalización XP
-3 XP por artefactos que dependen del entorno local sin documentar cómo ejecutarlos.

## Evidencia
Guardar Dockerfile, logs de ejecución y notas de configuración.

## Criterio de aprobación
El proyecto se puede ejecutar en un entorno reproducible con una sola explicación clara.
