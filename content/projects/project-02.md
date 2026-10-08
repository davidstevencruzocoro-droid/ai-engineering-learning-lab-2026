---
id: project-02
title: "Proyecto 2: Sistema full stack"
weekStart: 5
weekEnd: 8
xp: 180
---

# Proyecto 2: Sistema full stack

## Visión
Tomar la API del Proyecto 1 y convertirla en un sistema robusto: arquitectura en capas justificada, testing que prueba también los fallos, empaquetado reproducible con Docker y entrega automatizada con CI/CD.

## Problema
Un proyecto que "funciona" no es lo mismo que un proyecto mantenible. Este proyecto fuerza a aplicar disciplina de arquitectura y automatización sobre algo que ya existe, que es la situación real más común en el trabajo profesional (pocas veces se empieza de cero).

## Stack
Lo del Proyecto 1 + patrones de arquitectura en capas/hexagonal, Docker y Docker Compose, GitHub Actions.

## Entregables
- Refactorización documentada: qué estaba mal estructurado y cómo quedó después.
- Suite de tests ampliada que valida explícitamente casos de error, no solo el camino feliz.
- `Dockerfile` y `docker-compose.yml` que levantan la aplicación y su base de datos con un solo comando.
- Pipeline de CI/CD (`.github/workflows/`) que instala, testea y construye en cada push, y falla visiblemente si algo se rompe.

## Criterios de éxito
- El pipeline de CI/CD está en verde y realmente bloquea un cambio que rompe un test.
- `docker compose up` deja el sistema completo funcionando sin pasos manuales adicionales.
- La arquitectura está documentada con el razonamiento de las decisiones, no solo el diagrama.

## Conexión con el proyecto final
Este empaquetado y pipeline son los que se reutilizan para desplegar el sistema en el Proyecto 3 y en el proyecto final.
