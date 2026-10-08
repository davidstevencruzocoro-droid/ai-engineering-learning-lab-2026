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
